// Dynamic Pricing & Offers Calculation Service
import { storageService } from './storageService';
import { showService } from './showService';

export const pricingService = {
  getPricingConfig() {
    return storageService.get(storageService.KEYS.PRICING) || {
      convenienceFeePerTicket: 1.50,
      taxRatePercent: 12.0,
      weekendSurchargeMultiplier: 1.15,
      eveningSurchargeMultiplier: 1.10,
      maxSeatsPerBooking: 8
    };
  },

  updatePricingConfig(updates) {
    const current = this.getPricingConfig();
    const updated = { ...current, ...updates };
    storageService.set(storageService.KEYS.PRICING, updated);
    return updated;
  },

  getAllCoupons() {
    return storageService.get(storageService.KEYS.COUPONS) || [];
  },

  addCoupon(couponData) {
    if (!couponData.code || !couponData.value) {
      throw new Error('Coupon code and discount value are required.');
    }

    const coupons = this.getAllCoupons();
    const code = couponData.code.trim().toUpperCase();
    if (coupons.some(c => c.code === code)) {
      throw new Error(`Coupon with code '${code}' already exists.`);
    }

    const newCoupon = {
      code,
      description: couponData.description || 'Special discount',
      discountType: couponData.discountType || 'PERCENTAGE',
      value: Number(couponData.value),
      maxDiscount: Number(couponData.maxDiscount) || 10.0,
      minBookingAmount: Number(couponData.minBookingAmount) || 20.0,
      expiryDate: couponData.expiryDate || '2026-12-31',
      isActive: true
    };

    coupons.push(newCoupon);
    storageService.set(storageService.KEYS.COUPONS, coupons);
    return newCoupon;
  },

  validateCoupon(code, subtotal) {
    if (!code || !code.trim()) {
      return { valid: false, message: 'Please enter a coupon code.' };
    }

    const coupons = this.getAllCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code.' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon is no longer active.' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'This coupon has expired.' };
    }

    if (subtotal < coupon.minBookingAmount) {
      return {
        valid: false,
        message: `Minimum ticket subtotal of $${coupon.minBookingAmount.toFixed(2)} required for this code.`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount: Number(discount.toFixed(2)),
      message: `Coupon '${coupon.code}' applied successfully!`
    };
  },

  isWeekend(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  },

  calculateBookingPrice({ showId, selectedSeats, couponCode = null }) {
    if (!selectedSeats || !selectedSeats.length) {
      return {
        seatCount: 0,
        seatsBreakdown: [],
        subtotal: 0,
        discountAmount: 0,
        convenienceFee: 0,
        taxAmount: 0,
        totalAmount: 0,
        couponApplied: null
      };
    }

    const show = showService.getShowById(showId);
    const config = this.getPricingConfig();
    const isWknd = show ? this.isWeekend(show.date) : false;
    const weekendMultiplier = isWknd ? (config.weekendSurchargeMultiplier || 1.15) : 1.0;

    // Format premium
    let formatPremium = 0;
    if (show && show.format) {
      if (show.format.includes('IMAX')) formatPremium = 4.0;
      else if (show.format.includes('4DX')) formatPremium = 5.0;
      else if (show.format.includes('Dolby')) formatPremium = 3.0;
      else if (show.format.includes('3D')) formatPremium = 2.0;
    }

    let subtotal = 0;
    const seatsBreakdown = selectedSeats.map(seat => {
      const baseCategoryPrice = seat.basePrice || 14.0;
      const adjustedPrice = (baseCategoryPrice + formatPremium) * weekendMultiplier;
      const roundedPrice = Number(adjustedPrice.toFixed(2));
      subtotal += roundedPrice;

      return {
        seatNumber: seat.seatNumber,
        category: seat.categoryName || seat.category || 'Standard',
        basePrice: baseCategoryPrice,
        finalPrice: roundedPrice
      };
    });

    subtotal = Number(subtotal.toFixed(2));

    // Calculate coupon discount
    let discountAmount = 0;
    let couponApplied = null;
    if (couponCode) {
      const couponCheck = this.validateCoupon(couponCode, subtotal);
      if (couponCheck.valid) {
        discountAmount = couponCheck.discountAmount;
        couponApplied = couponCheck.coupon;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Convenience fee & tax
    const convenienceFee = Number(
      ((config.convenienceFeePerTicket || 1.50) * selectedSeats.length).toFixed(2)
    );
    
    const taxableAmount = discountedSubtotal + convenienceFee;
    const taxRate = config.taxRatePercent || 12.0;
    const taxAmount = Number(((taxableAmount * taxRate) / 100).toFixed(2));

    const totalAmount = Number((discountedSubtotal + convenienceFee + taxAmount).toFixed(2));

    return {
      seatCount: selectedSeats.length,
      seatsBreakdown,
      subtotal,
      discountAmount,
      couponApplied,
      convenienceFee,
      taxAmount,
      taxRate,
      isWeekend: isWknd,
      totalAmount
    };
  }
};

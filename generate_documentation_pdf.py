import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

# Palette definition
COLOR_PRIMARY_DARK = colors.HexColor("#0f1015")
COLOR_CARD_BG = colors.HexColor("#161821")
COLOR_TERTIARY_BG = colors.HexColor("#1f2230")
COLOR_ACCENT_RED = colors.HexColor("#e50914")
COLOR_ACCENT_GOLD = colors.HexColor("#e5a93c")
COLOR_ACCENT_TEAL = colors.HexColor("#00c9a7")
COLOR_ACCENT_BLUE = colors.HexColor("#3b82f6")
COLOR_TEXT_LIGHT = colors.HexColor("#f8fafc")
COLOR_TEXT_MUTED = colors.HexColor("#94a3b8")
COLOR_BORDER_LIGHT = colors.HexColor("#2e3446")
COLOR_CODE_BG = colors.HexColor("#12141c")

class NumberedCanvas(canvas.Canvas):
    """Canvas that enables two-pass page numbering and professional running headers/footers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        
        # Don't draw headers/footers on the cover page
        if self._pageNumber > 1:
            # Header
            self.setFillColor(COLOR_TEXT_MUTED)
            self.setFont("Helvetica-Bold", 8)
            self.drawString(54, 11 * inch - 36, "CINELOOM")
            self.setFont("Helvetica", 8)
            self.drawString(110, 11 * inch - 36, "|  System Design, Workflows & .NET C# / SQL Backend Architecture")
            
            self.setStrokeColor(COLOR_BORDER_LIGHT)
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)
            
            # Footer
            self.line(54, 45, 8.5 * inch - 54, 45)
            self.setFillColor(COLOR_TEXT_MUTED)
            self.setFont("Helvetica", 8)
            self.drawString(54, 32, "Cineloom Cinema Networks  •  Presented By Anshi, Mehak and Sachin")
            self.drawRightString(8.5 * inch - 54, 32, f"Page {self._pageNumber} of {page_count}")
            
        self.restoreState()


def create_callout_box(title, text, accent_color=COLOR_ACCENT_RED, bg_color=COLOR_CARD_BG, width=490):
    content = [
        Paragraph(f"<b><font color='{accent_color.hexval()}'>{title}</font></b>", 
                  ParagraphStyle('CalloutTitle', fontName='Helvetica-Bold', fontSize=9.5, textColor=COLOR_TEXT_LIGHT, spaceAfter=3)),
        Paragraph(text, 
                  ParagraphStyle('CalloutText', fontName='Helvetica', fontSize=8, leading=11.5, textColor=COLOR_TEXT_MUTED))
    ]
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_color),
        ('BOX', (0, 0), (-1, -1), 0.75, COLOR_BORDER_LIGHT),
        ('LINELEFT', (0, 0), (0, -1), 3.5, accent_color),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    return t


def create_code_block(code_text, width=490):
    p = Preformatted(code_text, ParagraphStyle(
        'CodeStyle',
        fontName='Courier',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#93c5fd")
    ))
    
    t = Table([[p]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_CODE_BG),
        ('BOX', (0, 0), (-1, -1), 0.75, COLOR_BORDER_LIGHT),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t


def build_pdf(filename="Cineloom_Technical_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=COLOR_TEXT_LIGHT,
        alignment=0,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica',
        fontSize=11.5,
        leading=15,
        textColor=COLOR_ACCENT_GOLD,
        alignment=0,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=COLOR_ACCENT_RED,
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=COLOR_TEXT_LIGHT,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=COLOR_TEXT_MUTED,
        spaceAfter=5
    )

    table_header_style = ParagraphStyle(
        'THStyle',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=COLOR_TEXT_LIGHT
    )

    table_cell_style = ParagraphStyle(
        'TDStyle',
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=COLOR_TEXT_MUTED
    )

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 15))
    
    # Brand Header Pill
    brand_header = Table([[
        Paragraph("<font color='#ffffff'><b>CINELOOM</b></font> <font color='#e50914'><b>•</b></font> <font color='#94a3b8'>SYSTEM DESIGN & BACKEND ARCHITECTURE</font>", 
                  ParagraphStyle('BHeader', fontName='Helvetica-Bold', fontSize=9, textColor=COLOR_TEXT_LIGHT))
    ]], colWidths=[490])
    brand_header.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, COLOR_ACCENT_RED),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(brand_header)
    story.append(Spacer(1, 18))

    story.append(Paragraph("Cineloom: System Design, Business Workflows & Backend Architecture", title_style))
    story.append(Paragraph("Enterprise Architecture Specification: ASP.NET Core C# Microservices, Relational SQL Engine, Concurrency & API Design", subtitle_style))
    
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_ACCENT_RED, spaceBefore=4, spaceAfter=14))

    # Authors Card
    authors_table = Table([
        [
            Paragraph("<b>Project:</b> Cineloom Cinema Platform", table_cell_style),
            Paragraph("<b>Authors:</b> By Anshi, Mehak and Sachin", table_header_style)
        ],
        [
            Paragraph("<b>Backend Engine:</b> ASP.NET Core (.NET 8 C# Web API)", table_cell_style),
            Paragraph("<b>Database Engine:</b> Microsoft SQL Server / PostgreSQL (ACID 3NF)", table_cell_style)
        ],
        [
            Paragraph("<b>Concurrency Strategy:</b> Distributed Lock + Optimistic RowVersion", table_cell_style),
            Paragraph("<b>Architecture Pattern:</b> Clean Architecture & Domain-Driven Design", table_cell_style)
        ]
    ], colWidths=[245, 245])
    authors_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CARD_BG),
        ('BOX', (0,0), (-1,-1), 0.75, COLOR_BORDER_LIGHT),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER_LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(authors_table)
    story.append(Spacer(1, 12))

    # Executive Overview Callout
    story.append(create_callout_box(
        "Executive System Design Summary",
        "Cineloom is engineered as a resilient, high-throughput movie ticketing platform capable of handling intense traffic surges during blockbuster ticket releases. The system addresses critical distributed systems challenges including zero-collision seat reservations, atomic multi-seat transactions, dynamic surcharge calculations, conflict-free screening scheduling, idempotent payment settlement, and automated refund auditing. This document details the end-to-end system design, business workflows, SQL database schema, and C# .NET backend architecture."
    ))
    story.append(Spacer(1, 10))

    story.append(create_callout_box(
        "Core System Capabilities",
        "1. Real-Time Seat Locking: 5-minute temporary hold with distributed TTL and database row isolation.<br/>"
        "2. Dynamic Pricing Engine: Time-of-day, weekend multiplier, screen format fees, and promo discounts.<br/>"
        "3. Collision-Free Scheduling: Mathematical screen timeline collision validator with turnaround buffers.<br/>"
        "4. Automated Tiered Cancellation: Time-to-showtime refund calculation (80% / 50% / 0%) with instant seat recovery.<br/>"
        "5. Clean Architecture Backend: Decoupled domain, application, infrastructure, and RESTful API layers in C# .NET.",
        accent_color=COLOR_ACCENT_GOLD
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: HIGH LEVEL SYSTEM ARCHITECTURE & TOPOLOGY
    # =========================================================================
    story.append(Paragraph("1. High-Level System Architecture & Topology", h1_style))
    story.append(Paragraph(
        "The Cineloom platform adopts a Clean Layered Architecture with decoupled responsibilities across the application boundary:",
        body_style
    ))

    sys_topology = """+-----------------------------------------------------------------------------------+
|                              CLIENT TIER (Web Client)                             |
|       - Movie Discovery  - Seat Matrix Selection  - Checkout  - Management UI    |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON (REST API)
                                           v
+-----------------------------------------------------------------------------------+
|                         API GATEWAY / LOAD BALANCER                               |
|       - SSL Termination  - JWT Authentication  - Rate Limiting  - CORS Control    |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                     APPLICATION & BUSINESS LAYER (ASP.NET Core C#)                |
|  [AuthController]  [MovieCatalogService]  [SeatLockManager]  [PricingCalculator]  |
|  [BookingService]  [CancellationEngine]   [ScheduleValidator][AuditLoggerService] |
+---------------------+--------------------+--------------------+-------------------+
                      |                    |                    |
         +------------v-----------+        |        +-----------v-----------+
         | DISTRIBUTED CACHE      |        |        | PAYMENT GATEWAY MOCK  |
         | Redis (5-Min Seat TTL) |        |        | (Card, UPI, NetBank)  |
         +------------------------+        |        +-----------------------+
                                           v
+-----------------------------------------------------------------------------------+
|                         DATA ACCESS & PERSISTENCE LAYER                           |
|       - Entity Framework Core 8 (ORM)    - Dapper (High-Throughput Queries)       |
|       - Unit of Work Pattern             - Database Transaction Manager           |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                       RELATIONAL DATABASE (SQL Server / PostgreSQL)               |
|       - 3NF Normalized Tables            - ACID Transaction Isolation             |
|       - RowVersion Optimistic Tokens     - Foreign Keys & Unique Constraints      |
+-----------------------------------------------------------------------------------+"""
    story.append(create_code_block(sys_topology, width=490))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: END-TO-END BUSINESS WORKFLOWS & DATA FLOWS
    # =========================================================================
    story.append(Paragraph("2. End-to-End Business & Data Workflows", h1_style))
    
    story.append(Paragraph("Flow 1: Movie Discovery & Multi-Criteria Search", h2_style))
    story.append(Paragraph(
        "1. The client submits a query with optional filters (Genre, Language, Format, City, Status).<br/>"
        "2. The API checks the Redis catalog cache. On cache hit, results return in sub-10ms.<br/>"
        "3. On cache miss, Dapper executes a parameterized SQL query filtering active movies, caches the result set for 15 minutes, and returns the response.",
        body_style
    ))

    story.append(Paragraph("Flow 2: Seat Availability, Concurrency & 5-Minute Locking", h2_style))
    story.append(Paragraph(
        "1. The customer selects a showtime. The backend retrieves the seat layout with current states (Available, Locked, Booked).<br/>"
        "2. The customer selects up to 8 seats and clicks 'Lock Seats'.<br/>"
        "3. The backend opens a database transaction with Row-Level Isolation and checks if any requested seat is in 'BOOKED' or 'LOCKED' status.<br/>"
        "4. If available, seats are updated to 'LOCKED', assigned the customer's UserId, and given a LockExpiresAt timestamp (Current UTC + 300 seconds).<br/>"
        "5. A background worker periodically sweeps and resets any expired locks whose LockExpiresAt < Current UTC.",
        body_style
    ))

    story.append(Paragraph("Flow 3: Dynamic Price Computation & Offer Validation", h2_style))
    story.append(Paragraph(
        "1. Base seat tier rates are resolved: Regular (₹220.00), Premium (₹320.00), VIP Recliner (₹480.00).<br/>"
        "2. Format surcharge is added (IMAX 3D +₹80.00, 4DX +₹100.00, Dolby +₹60.00, 3D +₹40.00).<br/>"
        "3. Weekend multiplier is applied (15% surcharge for Saturday and Sunday shows).<br/>"
        "4. Promo voucher validation checks active status, expiration date, and minimum booking threshold, applying percentage caps.<br/>"
        "5. Convenience fee (₹35.00/seat) and GST/Tax (18%) are added to calculate the immutable grand total.",
        body_style
    ))

    story.append(Paragraph("Flow 4: Payment Authorization & Atomic Booking Confirmation", h2_style))
    story.append(Paragraph(
        "1. The client sends payment details and the locked seat token.<br/>"
        "2. The payment gateway verifies funds and returns a successful transaction ID.<br/>"
        "3. Within a single atomic database transaction: seats transition from 'LOCKED' to 'BOOKED', a unique booking reference (e.g. CNL-782910) is generated, a Booking record is committed, and an audit entry is logged.<br/>"
        "4. If payment fails, the transaction rolls back and seats are immediately released.",
        body_style
    ))

    story.append(Paragraph("Flow 5: Booking Cancellation & Tiered Refund Processing", h2_style))
    story.append(Paragraph(
        "1. The customer initiates cancellation from booking history.<br/>"
        "2. The backend computes hours remaining until showtime: >2 hours grants 80% refund of base ticket price; 1 to 2 hours grants 50%; <1 hour is non-refundable.<br/>"
        "3. The booking status updates to 'REFUNDED', convenience fees are retained, booked seats are freed back to the available inventory, and an audit receipt is recorded.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: RELATIONAL DATABASE DESIGN (SQL DDL)
    # =========================================================================
    story.append(Paragraph("3. Relational Database Design & SQL Schema", h1_style))
    story.append(Paragraph(
        "A normalized third-normal-form (3NF) relational database schema enforces strict referential integrity and zero data duplication:",
        body_style
    ))

    story.append(Paragraph("A. Master Master Tables (Users, Theatres & Screens)", h2_style))
    sql_schema_part1 = """CREATE TABLE Users (
    UserId NVARCHAR(50) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(120) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Role NVARCHAR(20) DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'ADMINISTRATOR'
    City NVARCHAR(50) DEFAULT 'New York',
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE Theatres (
    TheatreId NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    City NVARCHAR(50) NOT NULL,
    LocationAddress NVARCHAR(255) NOT NULL,
    Rating DECIMAL(2,1) DEFAULT 4.8,
    IsActive BIT DEFAULT 1
);

CREATE TABLE Screens (
    ScreenId NVARCHAR(50) PRIMARY KEY,
    TheatreId NVARCHAR(50) FOREIGN KEY REFERENCES Theatres(TheatreId) ON DELETE CASCADE,
    Name NVARCHAR(100) NOT NULL,
    ScreenFormat NVARCHAR(30) NOT NULL, -- '2D', '3D', 'IMAX 3D', '4DX', 'Dolby Cinema'
    TotalCapacity INT NOT NULL,
    IsActive BIT DEFAULT 1
);"""
    story.append(create_code_block(sql_schema_part1, width=490))
    story.append(Spacer(1, 6))

    story.append(Paragraph("B. Catalog & Showtime Scheduling Tables", h2_style))
    sql_schema_part2 = """CREATE TABLE Movies (
    MovieId NVARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Genre NVARCHAR(50) NOT NULL,
    Language NVARCHAR(50) NOT NULL,
    DurationMinutes INT NOT NULL,
    Certification NVARCHAR(10) NOT NULL, -- 'U', 'UA13+', 'UA16+', 'A'
    Rating DECIMAL(2,1) DEFAULT 8.5,
    ReleaseDate DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- 'NOW_SHOWING', 'UPCOMING', 'ARCHIVED'
    Director NVARCHAR(100),
    CastMembers NVARCHAR(MAX),
    Description NVARCHAR(MAX),
    PosterUrl NVARCHAR(500),
    BannerUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1
);

CREATE TABLE Shows (
    ShowId NVARCHAR(50) PRIMARY KEY,
    MovieId NVARCHAR(50) FOREIGN KEY REFERENCES Movies(MovieId),
    TheatreId NVARCHAR(50) FOREIGN KEY REFERENCES Theatres(TheatreId),
    ScreenId NVARCHAR(50) FOREIGN KEY REFERENCES Screens(ScreenId),
    ShowDate DATE NOT NULL,
    StartTime NVARCHAR(10) NOT NULL, -- e.g. '07:30 PM'
    EndTime NVARCHAR(10) NOT NULL,
    BasePrice DECIMAL(10,2) NOT NULL,
    IsActive BIT DEFAULT 1
);

-- Seat Concurrency Table with SQL Server RowVersion Token
CREATE TABLE ShowSeats (
    ShowSeatId NVARCHAR(100) PRIMARY KEY,
    ShowId NVARCHAR(50) FOREIGN KEY REFERENCES Shows(ShowId),
    SeatNumber NVARCHAR(10) NOT NULL, -- e.g. 'D4', 'H9'
    CategoryName NVARCHAR(30) NOT NULL, -- 'Regular', 'Premium', 'VIP Recliner'
    SeatStatus NVARCHAR(20) NOT NULL, -- 'AVAILABLE', 'LOCKED', 'BOOKED'
    LockedByUserId NVARCHAR(50) NULL,
    LockExpiresAt DATETIME2 NULL,
    RowVersion ROWVERSION -- Optimistic Concurrency Token
);"""
    story.append(create_code_block(sql_schema_part2, width=490))
    story.append(Spacer(1, 6))

    story.append(Paragraph("C. Booking, Transaction & Audit Tables", h2_style))
    sql_schema_part3 = """CREATE TABLE Bookings (
    BookingId NVARCHAR(50) PRIMARY KEY,
    BookingReference NVARCHAR(20) UNIQUE NOT NULL, -- e.g. 'CNL-782910'
    UserId NVARCHAR(50) FOREIGN KEY REFERENCES Users(UserId),
    ShowId NVARCHAR(50) FOREIGN KEY REFERENCES Shows(ShowId),
    SeatCount INT NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    DiscountAmount DECIMAL(10,2) DEFAULT 0.0,
    AppliedCouponCode NVARCHAR(30) NULL,
    ConvenienceFee DECIMAL(10,2) NOT NULL,
    TaxAmount DECIMAL(10,2) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    BookingStatus NVARCHAR(20) NOT NULL, -- 'CONFIRMED', 'CANCELLED', 'REFUNDED'
    PaymentStatus NVARCHAR(20) NOT NULL, -- 'SUCCESSFUL', 'FAILED', 'REFUNDED'
    PaymentMethod NVARCHAR(30) NOT NULL, -- 'CARD', 'UPI', 'NET_BANKING'
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE AuditLogs (
    LogId NVARCHAR(50) PRIMARY KEY,
    Timestamp DATETIME2 DEFAULT SYSUTCDATETIME(),
    ActionType NVARCHAR(50) NOT NULL, -- 'BOOKING_CONFIRMED', 'SEATS_LOCKED', etc.
    UserId NVARCHAR(50) NULL,
    Severity NVARCHAR(20) NOT NULL, -- 'INFO', 'WARN', 'ERROR', 'AUDIT'
    EventPayload NVARCHAR(MAX) NOT NULL
);"""
    story.append(create_code_block(sql_schema_part3, width=490))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: C# .NET BACKEND ENGINEERING & CONTROLLERS
    # =========================================================================
    story.append(Paragraph("4. C# .NET Backend Architecture (ASP.NET Core Web API)", h1_style))
    story.append(Paragraph(
        "The ASP.NET Core backend implements Domain-Driven Design (DDD) with Dependency Injection:",
        body_style
    ))

    csharp_controller_code = """// BookingController.cs — ASP.NET Core REST API Controller
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ISeatService _seatService;
    private readonly ILogger<BookingController> _logger;

    public BookingController(IBookingService bookingService, ISeatService seatService, ILogger<BookingController> logger)
    {
        _bookingService = bookingService;
        _seatService = seatService;
        _logger = logger;
    }

    [HttpPost("lock-seats")]
    public async Task<IActionResult> LockSeats([FromBody] LockSeatsDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _seatService.LockSeatsAsync(request.ShowId, request.SeatNumbers, userId);
        if (!result.IsSuccess) 
            return StatusCode(StatusCodes.Status409Conflict, new { message = result.ErrorMessage });
            
        return Ok(new { success = true, data = result.Data });
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmBooking([FromBody] CreateBookingDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var booking = await _bookingService.CreateAndConfirmBookingAsync(userId, request);
        return Ok(new { success = true, booking });
    }

    [HttpPost("{bookingId}/cancel")]
    public async Task<IActionResult> CancelBooking(string bookingId, [FromBody] CancelRequestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var refundResult = await _bookingService.ProcessCancellationAsync(bookingId, userId, dto.Reason);
        return Ok(refundResult);
    }
}"""
    story.append(create_code_block(csharp_controller_code, width=490))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 5: REST API SPECIFICATIONS
    # =========================================================================
    story.append(Paragraph("5. Complete REST API Specifications & Contracts", h1_style))
    story.append(Paragraph(
        "Standardized REST API contracts consumed by the frontend and external integrations:",
        body_style
    ))

    api_endpoints_table = Table([
        [Paragraph("HTTP Route", table_header_style), Paragraph("Auth", table_header_style), Paragraph("Request Payload", table_header_style), Paragraph("Response Contract", table_header_style)],
        [
            Paragraph("<font color='#3b82f6'><b>POST</b></font> /api/auth/login", table_cell_style),
            Paragraph("Public", table_cell_style),
            Paragraph("{ email, password }", table_cell_style),
            Paragraph("{ token, userProfile }", table_cell_style)
        ],
        [
            Paragraph("<font color='#3b82f6'><b>POST</b></font> /api/auth/register", table_cell_style),
            Paragraph("Public", table_cell_style),
            Paragraph("{ name, email, password, phone, role }", table_cell_style),
            Paragraph("{ token, userProfile }", table_cell_style)
        ],
        [
            Paragraph("<font color='#10b981'><b>GET</b></font> /api/movies", table_cell_style),
            Paragraph("Public", table_cell_style),
            Paragraph("?genre=Sci-Fi&status=NOW_SHOWING", table_cell_style),
            Paragraph("List<MovieCardDto>", table_cell_style)
        ],
        [
            Paragraph("<font color='#10b981'><b>GET</b></font> /api/shows", table_cell_style),
            Paragraph("Public", table_cell_style),
            Paragraph("?movieId=mov-1&date=2026-08-16&city=New York", table_cell_style),
            Paragraph("List<TheatreShowsDto>", table_cell_style)
        ],
        [
            Paragraph("<font color='#10b981'><b>GET</b></font> /api/seats/layout/{showId}", table_cell_style),
            Paragraph("Public", table_cell_style),
            Paragraph("None", table_cell_style),
            Paragraph("SeatMatrixLayoutDto", table_cell_style)
        ],
        [
            Paragraph("<font color='#3b82f6'><b>POST</b></font> /api/seats/lock", table_cell_style),
            Paragraph("Bearer JWT", table_cell_style),
            Paragraph("{ showId, seatNumbers: ['D4', 'D5'] }", table_cell_style),
            Paragraph("{ lockExpiresAt, lockedSeats }", table_cell_style)
        ],
        [
            Paragraph("<font color='#3b82f6'><b>POST</b></font> /api/booking/confirm", table_cell_style),
            Paragraph("Bearer JWT", table_cell_style),
            Paragraph("{ showId, seats, couponCode, paymentDetails }", table_cell_style),
            Paragraph("ConfirmedBookingPassDto", table_cell_style)
        ],
        [
            Paragraph("<font color='#ef4444'><b>POST</b></font> /api/booking/{id}/cancel", table_cell_style),
            Paragraph("Bearer JWT", table_cell_style),
            Paragraph("{ reason: 'Schedule change' }", table_cell_style),
            Paragraph("{ refundAmount, refundPercentage, status }", table_cell_style)
        ],
        [
            Paragraph("<font color='#e5a93c'><b>POST</b></font> /api/admin/shows/schedule", table_cell_style),
            Paragraph("Admin JWT", table_cell_style),
            Paragraph("{ movieId, screenId, date, startTime, price }", table_cell_style),
            Paragraph("{ showId, screenConflict: false }", table_cell_style)
        ]
    ], colWidths=[120, 55, 165, 150])
    api_endpoints_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_TERTIARY_BG),
        ('BACKGROUND', (0,1), (-1,-1), COLOR_CARD_BG),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER_LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(api_endpoints_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 6: CONCURRENCY, FAULT TOLERANCE & SCALE
    # =========================================================================
    story.append(Paragraph("6. Concurrency Strategy, Fault Tolerance & Scale", h1_style))
    
    story.append(Paragraph("A. Race Condition Prevention Mechanism", h2_style))
    story.append(Paragraph(
        "To guarantee that two concurrent requests for the same seat cannot both succeed, Cineloom utilizes a two-tier protection strategy:<br/>"
        "1. <b>Distributed In-Memory Lock (Redis)</b>: An atomic SETNX command acquires an exclusive lock key: `lock:show:{showId}:seat:{seatNumber}` with a 300-second TTL.<br/>"
        "2. <b>Database RowVersion Optimistic Concurrency</b>: If two transactions pass the memory lock simultaneously, SQL Server's RowVersion token detects the collision upon commit and throws a DbUpdateConcurrencyException, rolling back the loser transaction.",
        body_style
    ))

    story.append(Paragraph("B. Show Scheduling Collision Detection Algorithm", h2_style))
    story.append(Paragraph(
        "To eliminate screen double-booking, start times and movie durations are mapped to integer minutes on the day timeline, including a mandatory 20-minute turnaround and cleaning buffer. The scheduling service validates:<br/>"
        "<b>Overlap = (NewShowStart &lt; ExistingShowEnd) AND (NewShowEnd &gt; ExistingShowStart)</b>.<br/>"
        "If true, the conflict is returned with the name and timeslot of the blocking show, and scheduling is prohibited.",
        body_style
    ))

    story.append(Paragraph("C. Tiered Cancellation & Instant Refund Engine", h2_style))
    story.append(Paragraph(
        "Calculates time remaining until showtime:<br/>"
        "• More than 2 hours before show: 80% refund of base ticket price.<br/>"
        "• Between 1 and 2 hours before show: 50% refund.<br/>"
        "• Less than 1 hour before show: 0% refund (non-refundable).<br/>"
        "Convenience fees are non-refundable. Released seats are immediately restored to the active inventory.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 7: PROJECT PRESENTATION SUMMARY
    # =========================================================================
    story.append(Paragraph("7. Project Presentation Summary", h1_style))
    story.append(create_callout_box(
        "Presentation Sign-Off Note",
        "Cineloom represents an enterprise full-stack system design bridging intuitive customer interactions with robust .NET C# backend microservices and an ACID-compliant SQL schema. The architecture guarantees zero seat collisions, dynamic pricing precision, conflict-free scheduling, and complete auditability under peak cinema booking loads.<br/><br/><b>Presented by: Anshi, Mehak and Sachin</b><br/>Cineloom Cinema Networks • Master System Design & Technical Specification",
        accent_color=COLOR_ACCENT_GOLD
    ))

    # Build the document with custom numbered canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully: {filename}")

if __name__ == "__main__":
    build_pdf()

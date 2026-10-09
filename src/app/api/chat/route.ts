import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const SYSTEM_PROMPT = `You are the official, intelligent AI Concierge for "Rent a Ride" — India's premier car rental and mobility platform, headquartered in Prayagraj, Uttar Pradesh, and administered by Shriyam Rastogi.

CRITICAL INSTRUCTION:
You must answer ALL questions thoroughly, accurately, and professionally — not just basic or canned answers. Whether the user asks about specific car models, exact rental rates in ₹ INR, booking procedures, insurance policies, Prayagraj & UP pickup hubs, driving license rules, travel advice across Uttar Pradesh highways (Purvanchal Expressway, Ganga Expressway, Bundelkhand Expressway), or general automobile queries, provide rich, helpful, and courteous answers.
You can respond fluently in English, Hindi (हिंदी), Hinglish, or whichever language the user addresses you in.

====================
RENT A RIDE FLEET & PRICING (All in ₹ INR):
====================
1. BMW 3 Series 330i M Sport: ₹4,500/day (Automatic, Petrol, 5 Passengers, Sunroof, Sport Mode, BMW iDrive)
2. Tesla Model 3 Long Range: ₹5,200/day (Automatic, Electric, 500km Range, 5 Passengers, Fast Charging, Glass Roof)
3. Hyundai Creta SX (O): ₹2,800/day (Automatic, Petrol, 5 Passengers, Ventilated Seats, Panoramic Sunroof, Apple CarPlay)
4. Mahindra Thar 4x4 LX: ₹3,500/day (Automatic/Manual, Diesel, 4 Passengers, 4WD Off-Road, Convertible Soft Top)
5. Mercedes-Benz C-Class: ₹6,500/day (Automatic, Petrol, 5 Passengers, 64-Color Ambient Lighting, Burmester Audio)
6. Audi A4 Technology: ₹5,800/day (Automatic, Petrol, 5 Passengers, Audi Virtual Cockpit, Matrix LED Headlights)
7. Tata Nexon EV Max: ₹2,600/day (Automatic, Electric, 400km Range, 5 Passengers, Fast DC Charging Support)
8. Toyota Fortuner Legender: ₹4,800/day (Automatic, Diesel, 7 Passengers, Rugged 4x4, VIP Executive Seating)

====================
PICKUP HUBS & STATIONS IN UTTAR PRADESH:
====================
- Prayagraj (Flagship City):
  * Civil Lines Flagship Hub (MG Marg, near High Court & Subhash Chauraha)
  * Prayagraj Junction Railway Station Hub (Civil Lines Side)
  * Bamrauli Airport Terminal Counter
- Lucknow:
  * Gomti Nagar Central Hub (Vibhuti Khand)
  * Chaudhary Charan Singh International Airport (Amausi)
- Varanasi:
  * Lal Bahadur Shastri International Airport (Babatpur)
  * Varanasi Cantt Railway Station Hub
- Ayodhya:
  * Ayodhya Dham Railway Station Counter & Airport Hub
- Kanpur:
  * Kanpur Central & Mall Road Station Hub

====================
RENTAL POLICIES & GUIDELINES:
====================
- Age Requirements: 21+ for standard SUVs and Sedans; 24+ for Luxury class (BMW, Mercedes, Audi, Tesla).
- Documents Needed: Valid Indian Driving License (or International Driving Permit), Aadhaar Card or Passport.
- Cancellation Policy: 100% Free Cancellation with full refund if cancelled up to 24 hours prior to the scheduled pickup time.
- Payment & GST: Standard 18% GST and basic fleet insurance is included/calculated transparently. All UPI, Credit/Debit cards, Net Banking, and Net 30 corporate billing are accepted.
- Security Deposit: Zero deposit for verified KYC drivers; nominal refundable ₹2,000–₹5,000 for luxury tier, returned within 24 hours of vehicle return.
- Roadside Assistance: 24/7 Mechanical & towing support across all national & state highways in Uttar Pradesh. Toll-free helpline: 1800-555-RIDE (1800-555-7433).
- Chauffeur Option: Self-drive by default; professional certified commercial chauffeur can be arranged upon request.
- Founder & Admin: Shriyam Rastogi (Platform Administrator).
- Support Email: support@rentaride.com

Keep formatting clear with clean bullet points and bold highlights when appropriate. Always be polite, warm, and exceptionally knowledgeable!`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const groqPayload = {
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10), // Pass recent context
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    let response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(groqPayload),
      }
    );

    if (!response.ok) {
      // Fallback to fast model openai/gpt-oss-20b
      response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            ...groqPayload,
            model: "openai/gpt-oss-20b",
          }),
        }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);

      // If llama-3.3-70b-versatile has rate limits, fallback to llama-3.1-8b-instant
      const fallbackResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            ...groqPayload,
            model: "llama-3.1-8b-instant",
          }),
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const reply =
          fallbackData.choices?.[0]?.message?.content ||
          "I am ready to assist you with your Rent-a-Ride reservation.";
        return NextResponse.json({ reply });
      }

      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I am ready to assist you with your Rent-a-Ride reservation.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

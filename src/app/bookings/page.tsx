"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import "./BookingSummary.css"; // Import regular CSS file

const BookingSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBooking = JSON.parse(searchParams.get("data") || "[]");

  const today = new Date().toISOString().split("T")[0];

  const [bookings, setBookings] = useState(
    selectedBooking.map((booking: any) => ({
      ...booking,
      startDate: "",
      endDate: "",
    }))
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [bookings]);

  const handleDateChange = (id: number, type: string, value: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id ? { ...booking, [type]: value } : booking
      )
    );
  };

  const calculateTotal = () => {
    return bookings.reduce((total, booking) => {
      if (!booking.startDate || !booking.endDate) return total;
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days * booking.pricePerDay;
    }, 0);
  };

  const handleDelete = (id: number) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const storeBookingDetails = async () => {
    console.log("Storing booking details in Firestore...");
    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
        bookings,
        totalAmount,
        timestamp: new Date(),
      });

      console.log("Booking successfully stored with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error storing booking:", error);
      return null;
    }
  };

  const initializePayment = useFlutterwave({
    public_key: "FLWPUBK_TEST-d5ec3725cfa39a87b219099edd63ceb9-X",
    tx_ref: Date.now().toString(),
    amount: totalAmount,
    currency: "NGN",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: formData.email,
      phone_number: "",
      name: `${formData.firstName} ${formData.lastName}`,
    },
    customizations: {
      title: "Office Space Booking",
      description: "Payment for selected office spaces",
      logo: "/logo.png",
    },
    callback: (response) => {
      console.log("Payment response:", response);
      if (response.status === "successful") {
        console.log("Payment successful! Navigating to confirmation page...");
        router.push(`/booking-summary?status=success`);
      }
      closePaymentModal();
    },
    onClose: () => console.log("Payment modal closed"),
  });

  const handlePayment = async () => {
    console.log("Pay Now button clicked. Storing booking before payment...");
    setLoading(true);

    const bookingId = await storeBookingDetails();

    if (bookingId) {
      console.log("Booking stored successfully. Showing spinner...");

      setTimeout(() => {
        console.log("Hiding spinner and opening Flutterwave payment...");
        setLoading(false);
        initializePayment();
      }, 6000);
    } else {
      console.error("Booking not stored, payment aborted.");
      setLoading(false);
    }
  };

  return (
    <div className="bookingSummary">
      <table className="bookingTable">
        <thead>
          <tr>
            <th>Office Space</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="officeInfo">
                <Image src={booking.image} alt={booking.name} width={80} height={50} className="officeImage" />
                {booking.name}
              </td>
              <td>
                <input
                  type="date"
                  value={booking.startDate}
                  min={today}
                  onChange={(e) => handleDateChange(booking.id, "startDate", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={booking.endDate}
                  min={booking.startDate || today}
                  onChange={(e) => handleDateChange(booking.id, "endDate", e.target.value)}
                  disabled={!booking.startDate}
                />
              </td>
              <td>₦{totalAmount}</td>
              <td>
                <button className="deleteBtn" onClick={() => handleDelete(booking.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="userDetails">
        <h2>Your Details</h2>
        <p>Please fill in the form below.</p>
        <div className="formRow">
          <div className="formGroup">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
          </div>
          <div className="formGroup">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
          </div>
        </div>
        <div className="formRow">
          <div className="formGroup">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="formGroup">
            <label>Confirm Email</label>
            <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      <div className="nextButtonContainer">
        <button onClick={handlePayment} className="nextButton" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default BookingSummary;

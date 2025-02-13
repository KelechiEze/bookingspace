"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import "./BookingGrid.css"; // Import the updated CSS file

// Office space data
const officeSpaces = [
  {
    id: 1,
    name: "PRIVATE OFFICE",
    category: "private space",
    pricePerDay: 50000,
    rating: 3.5,
    reviews: 23,
    tag: "Popular",
    image: "/privateoffice.png",
  },
  {
    id: 2,
    name: "SHARED CO-WORK SPACE",
    category: "shared space",
    pricePerDay: 12000,
    rating: 4,
    reviews: 23,
    tag: "Top Rated",
    image: "/sharedcowork.jpeg",
  },
  {
    id: 3,
    name: "OFFICE SPACE",
    category: "office space",
    pricePerDay: 12000,
    rating: 3,
    reviews: 23,
    tag: "Popular",
    image: "/pace.jpg",
  },
  {
    id: 4,
    name: "CONFERENCE ROOM",
    category: "conference room",
    pricePerDay: 200000,
    rating: 3.5,
    reviews: 23,
    tag: "Popular",
    image: "/conferenceroom.jpg",
  },
];

const BookingGrid = () => {
  const router = useRouter();

  const handleBooking = (space: any) => {
    router.push(`/booking?page=${space.id}`);
  };

  return (
    <div className="booking-wrapper">
      <h2 className="booking-heading">
        BOOK <span className="purple-text">YOUR</span> SPACE
      </h2>

      <div className="booking-grid">
        {officeSpaces.map((space) => (
          <div key={space.id} className="booking-card">
            <div className={`tag ${space.tag === "Top Rated" ? "green" : "red"}`}>
              {space.tag}
            </div>
            <Image
              src={space.image}
              alt={space.name}
              width={300}
              height={200}
              className="booking-image"
            />
            <div className="booking-details">
              <p className="category">{space.category}</p>
              <h3 className="title">{space.name}</h3>
              <div className="ratings">
                <span className="stars">
                  {"★".repeat(Math.floor(space.rating))}
                  {"☆".repeat(5 - Math.floor(space.rating))}
                </span>
                <span className="reviews">({space.reviews})</span>
              </div>
              <div className="footer">
                <span className="price">₦{space.pricePerDay}/day</span>
                <button className="book-button" onClick={() => handleBooking(space)}>
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingGrid;

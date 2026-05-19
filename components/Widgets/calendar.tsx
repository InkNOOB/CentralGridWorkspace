"use client";

import { useState } from "react";

export default function CalendarWidget() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const gridSlots = [];

  // 1. Fill empty spaces for days from the previous month
  for (let i = 0; i < firstDayIndex; i++) {
    gridSlots.push(null);
  }

  // 2. Fill the actual days of the month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    gridSlots.push(day);
  }

  // FIX: Force the grid to always have exactly 42 slots (6 full rows)
  // This prevents the calendar box from expanding or shrinking!
  while (gridSlots.length < 42) {
    gridSlots.push(null);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6ff",
        borderRadius: "12px",
        padding: "16px",
        maxWidth: "500px",
        minWidth: "500px",
        height: "100mm",
        boxShadow: "-5px 8px 6px rgba(0, 0, 0, 0.16)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* CALENDAR HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          padding: "0 5px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "600", color: "#0f172a" }}>
          {months[currentMonth]} {currentYear}
        </h2>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={handlePrevMonth}
            style={{
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              background: "#f9f9f9",
            }}
          >
            ◀
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              background: "#f9f9f9",
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* DAYS OF WEEK HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "0.85rem",
          color: "#64748b",
          marginBottom: "12px",
        }}
      >
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* FIXED GRID MATRIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          rowGap: "6px", 
          textAlign: "center",
          fontSize: "0.95rem",
          flexGrow: 1,
        }}
      >
        {gridSlots.map((day, index) => {
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "32px",
                width: "32px",
                margin: "auto",
                borderRadius: "50%",
                backgroundColor: isToday ? "#658effff" : "transparent",
                color: isToday ? "#fff" : day ? "#0f172a" : "transparent",
                fontWeight: isToday ? "700" : "500",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React from 'react';

/**
 * 
 * @param {Object} props 
 * @param {string} props.name - The name to display on the button
 * @param {string} [props.color="blue"] - The color theme for the button ("blue" or "red")
 */
export default function PlayerSelectButton({ name, color = "blue" }) {
  // Define styles for blue and red themes
  const colorStyles = {
    blue: "bg-gradient-to-b from-blue-300 to-blue-500 text-blue-900",
    red: "bg-gradient-to-b from-red-300 to-red-500 text-red-900",
  };

  return (
    <div
      className={`flex justify-center items-center w-48 h-32 rounded-lg shadow-lg text-2xl font-bold ${
        colorStyles[color] || colorStyles.blue // Fallback to blue if color is invalid
      }`}
    >
      {name}
    </div>
  );
}

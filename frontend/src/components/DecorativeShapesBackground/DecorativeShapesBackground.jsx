import React from "react";

export default function DecorativeShapesBackground() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Decorative Shapes */}
      <div className="absolute top-10 left-10 transform rotate-45 w-8 h-8 border-2 border-blue-500 rounded-lg opacity-50"></div>
      <div className="absolute top-32 right-10 w-8 h-8 border-2 border-yellow-500 rounded-full opacity-50"></div>
      <div className="absolute bottom-16 left-16 w-8 h-8 border-2 border-pink-500 opacity-50"></div>
      <div className="absolute bottom-8 right-20 transform rotate-12 w-8 h-8 border-2 border-red-500 opacity-50"></div>
      <div className="absolute top-1/4 left-1/3 w-6 h-6 border-2 border-green-500 rounded-lg opacity-50"></div>
      <div className="absolute top-1/2 right-1/4 w-10 h-10 border-2 border-purple-500 rounded-full opacity-50"></div>
      <div className="absolute bottom-1/3 left-1/4 transform rotate-45 w-8 h-8 border-2 border-orange-500 rounded-lg opacity-50"></div>
      <div className="absolute top-3/4 right-1/3 w-8 h-8 border-2 border-teal-500 rounded-full opacity-50"></div>
    </div>
  );
}

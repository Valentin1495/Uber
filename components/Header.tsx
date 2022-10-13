import React from "react";

const Header = () => {
  return (
    <header>
      <div className="flex items-center">
        <div className="flex-1">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
            alt="Uber Logo"
            className="h-28 w-28 object-contain"
          />
        </div>
        <div className="flex items-center gap-x-3 font-bold text-lg">
          <span>Mark Zuckerberg</span>
          <img
            src="https://imageio.forbes.com/specials-images/imageserve/5c76b7d331358e35dd2773a9/0x0.jpg?format=jpg&crop=4401,4401,x0,y0,safe&height=416&width=416&fit=bounds"
            alt="Avatar"
            className="rounded-full h-14 w-14 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

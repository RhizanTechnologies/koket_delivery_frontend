import React from "react";

function Header({ text }: { text: string }) {
  return (
    <div className="">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-kaushan mb-4 sm:mb-6 text-center">
        {text}
      </h2>
    </div>
  );
}

export default Header;

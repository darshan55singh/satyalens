import { useEffect, useState } from "react";
import bg1 from "@/assets/bg-1.jpg";
import bg2 from "@/assets/bg-2.jpg";
import bg3 from "@/assets/bg-3.jpg";
import bg4 from "@/assets/bg-4.jpg";
import bg5 from "@/assets/bg-5.jpg";

const backgrounds = [bg1, bg2, bg3, bg4, bg5];

const AnimatedBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms]"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundAttachment: "fixed",
            opacity: i === currentIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-overlay" />
    </div>
  );
};

export default AnimatedBackground;

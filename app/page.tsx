"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX } from "react";

function Nav() {
  return (
    <nav className="flex items-center justify-between fixed w-screen top-0 left-0 px-4 py-4 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-lg">TransParent</h1>
        <p className="text-xs text-(--secondaryText)">Know more. Worry less</p>
      </div>
      <div>
        <button className="button">SignIn</button>
      </div>
    </nav>
  );
}
function Home() {
  const router = useRouter();
  return (
    <div className="text-center flex flex-col gap-3 items-center justify-center mt-30 mx-3">
      <h1 className="text-4xl max-w-2xl">
        TransParent Communication Between Teachers and Parents
      </h1>
      <p className="text-(--secondaryText) max-w-2xl">
        Keep parents informed with instant incident reports and maintain a clear
        record of student behavior and academic progress.
      </p>
      <div className="flex gap-3">
        <button className="button" onClick={() => router.push("/login")}>
          Get Started
        </button>
        <button
          className="border-(--borderColor) text-black rounded-md px-4 py-2 ml-4"
          onClick={() => router.push("/signup")}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
function Features() {
  function Card({
    title,
    description,
    svg,
  }: {
    title: string;
    description: string;
    svg: JSX.Element;
  }) {
    return (
      <div className="bg-white shadow-md w-[90%] py-4 px-4 flex flex-col gap-3 rounded-md">
        <div className={`bg-(--brandColorOpaque) w-fit h-fit p-3 rounded-md`}>
          {svg}
        </div>
        <div>
          <h1 className="text-lg font-medium">{title}</h1>
          <p className="text-sm text-(--secondaryText)">{description}</p>
        </div>
      </div>
    );
  }
  const cards: Array<{ title: string; description: string; svg: JSX.Element }> =
    [
      {
        title: "Instant Reports",
        description:
          "Send incident reports to parents immediately with detailed descriptions and severity levels.",
        svg: (
          <svg
            fill="currentColor"
            className="fill-(--brandColor)"
            width={32}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path d="M267.7 576.9C267.7 576.9 267.7 576.9 267.7 576.9L229.9 603.6C222.6 608.8 213 609.4 205 605.3C197 601.2 192 593 192 584L192 512L160 512C107 512 64 469 64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L359.6 512L267.7 576.9zM332 472.8C340.1 467.1 349.8 464 359.7 464L480 464C506.5 464 528 442.5 528 416L528 192C528 165.5 506.5 144 480 144L160 144C133.5 144 112 165.5 112 192L112 416C112 442.5 133.5 464 160 464L216 464C226.4 464 235.3 470.6 238.6 479.9C239.5 482.4 240 485.1 240 488L240 537.7C272.7 514.6 303.3 493 331.9 472.8z" />
          </svg>
        ),
      },
      {
        title: "Secure Platform",
        description:
          "All communications are encrypted and stored securely, ensuring student privacy and data protection",
        svg: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            width={32}
            fill="none"
            stroke="currentColor"
            strokeWidth={32}
            className="stroke-(--brandColor)"
          >
            <path d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64z" />
          </svg>
        ),
      },
      {
        title: "Track History",
        description:
          "Maintain a complete record of all incidents and communications for each student.",
        svg: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            width={32}
            fill="currentColor"
            className="fill-(--brandColor)"
          >
            <path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
          </svg>
        ),
      },
    ];
  return (
    <div className="flex flex-col gap-8 items-center my-20 ">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          svg={card.svg}
        />
      ))}
    </div>
  );
}
export default function Page() {
  return (
    <div>
      <Nav />
      <Home />
      <Features />
    </div>
  );
}

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaCar, FaMapMarkedAlt } from "react-icons/fa";

const Home: NextPage = () => {
  return (
    <div className="mx-auto sm:max-w-xl sm:px-24 md:max-w-3xl md:px-32 flex flex-col items-center justify-center h-screen pb-24">
      <Head>
        <title>Uber 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img
        src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
        alt="Uber Logo"
        className="h-24 w-24 object-contain"
      />
      <div className="flex gap-x-3 items-center">
        <Link href="/locations">
          <button
            className="bg-gray-200 rounded-md flex flex-col 
          items-center py-3 space-y-1.5 w-44"
          >
            <FaCar className="h-20 w-20" />
            <p className="font-bold text-2xl">Book a Ride</p>
          </button>
        </Link>
        <Link href="/search">
          <button
            className="bg-gray-200 rounded-md flex flex-col 
          items-center py-3 space-y-1.5 w-44"
          >
            <FaMapMarkedAlt className="h-20 w-20" />
            <p className="font-bold text-2xl">Book a Place</p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

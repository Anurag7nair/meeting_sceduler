import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button"
import Header from "./_components/Header"
import { DESTRUCTION } from "dns";
import Hero from "./_components/Hero"

export default function Home() {
  return (
    <div>
      <Header/>

      <Hero/>
    </div>
  );
}

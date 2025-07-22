"use client";

import Image from "../../public/Girlhype-Logo-removebg-preview.png";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../styles/LandingHero.module.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <section className={styles.landingSection}>
      <div className={styles.container}>
        <div className={styles.mb12}>
         <h1 className={styles.heading}>
  <img
    src="/Girlhype-Logo-removebg-preview.png"
    alt="GirlHype Logo"
    style={{ height: "100px", marginBottom: "0.5rem" }}
  />
 
</h1>


          <p className={styles.subHeading}>
            Your world. Your people. Your platform.
          </p>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>
            Ready to join the conversation?
          </h2>
          <p className={styles.description}>
            Start connecting with people who share your interests. Join GirlHype
            Connect today and discover a world of possibilities.
          </p>

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.createAccount}`}
              onClick={() => router.push("/register")}
            >
              Create Account
              <ArrowRight size={18} />
            </button>

            <button
              className={`${styles.button} ${styles.login}`}
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

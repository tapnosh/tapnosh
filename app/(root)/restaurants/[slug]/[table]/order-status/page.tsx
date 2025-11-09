"use client";

import MultiStatusDemo from "@/features/status/multi-status";

export default function Restaurant() {
  return (
    <>
      <section className="section">
        <h1>Order status</h1>
        <h6 className="mb-6">Track your order and know when it&apos;s ready</h6>

        <MultiStatusDemo />
      </section>
    </>
  );
}

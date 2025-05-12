"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../../store";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-20">
      <Provider store={store}>
      {children}
      </Provider>
    </div>
  );
}

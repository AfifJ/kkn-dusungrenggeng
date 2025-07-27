"use client";

import React from "react";
import DataUsahaForm from "../components/DataUsahaForm";

export default function EditDataUsahaPage({ params }) {
  const unwrappedParams = React.use(params);
  return <DataUsahaForm id={unwrappedParams.id} />;
}

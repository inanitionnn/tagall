"use client";
import { signOut } from "next-auth/react";
import { Header, Paragraph } from "../_components/ui";

export default function Home() {
  return (
    <div>
      <Header vtag="h1">Home </Header>
      <Header vtag="h2">Home </Header>
      <Header vtag="h3">Home </Header>
      <Header vtag="h4">Home </Header>
      <Header vtag="h5">Home </Header>
      <Header vtag="h6">Home </Header>
      <Paragraph vsize={"lg"}>Home </Paragraph>
      <Paragraph vsize={"base"}>Home </Paragraph>
      <Paragraph vsize={"sm"}>Home </Paragraph>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}

import type { NextPage } from "next";

export type Layout<P = undefined> = (props: { children: React.ReactNode; params?: P }) => JSX.Element;

export interface ErrorPageProps {
  error: Error;
  reset: () => void;
}
export type ErrorPage = NextPage<ErrorPageProps>;

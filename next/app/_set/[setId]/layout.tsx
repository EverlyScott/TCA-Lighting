import { Metadata } from "next";
import { metadata as homeMetadata } from "#/layout";
import BasicLayout from "@/utils/BasicLayout";

export const metadata: Metadata = {
  title: `Edit Set | ${homeMetadata.title!.toString()}`,
};

export default BasicLayout;

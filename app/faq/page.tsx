import { redirect } from "next/navigation";

/** FAQ content is shown in a modal on the home page. */
export default function FaqPage() {
  redirect("/?openFaq=1");
}

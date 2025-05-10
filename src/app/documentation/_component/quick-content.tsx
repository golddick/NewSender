
import { QuickAuthentication } from "./sections/quick-authentication"
import { QuickRateLimits } from "./sections/quick-rate-limits"
import { SubscribersGet } from "./sections/subscribers-get"
import { QuickIntroduction } from "./sections/quick-introduction"
import { QuickQuickstart } from "./sections/quick-quickstart"
import { QuickErrorCodes } from "./sections/quick-error-codes"
import { QuickBestPractices } from "./sections/quick-best-practices"
import { SubscribersPost } from "./sections/subscribers-post"
import { SubscribersDelete } from "./sections/subscribers-delete"
import { NewslettersGet } from "./sections/newsletters-get"
import { NewslettersPost } from "./sections/newsletters-post"

interface QuickContentProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function QuickContent({ activeSection, setActiveSection }: QuickContentProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
      <div className=" md:container mx-auto space-y-8">
        {/* General Documentation */}
        <section id="introduction" className={activeSection === "introduction" ? "" : "hidden"}>
          <QuickIntroduction />
        </section>

        <section id="authentication" className={activeSection === "authentication" ? "" : "hidden"}>
          <QuickAuthentication />
        </section>

        <section id="quickstart" className={activeSection === "quickstart" ? "" : "hidden"}>
          <QuickQuickstart />
        </section>

        <section id="rate-limits" className={activeSection === "rate-limits" ? "" : "hidden"}>
          <QuickRateLimits />
        </section>

        <section id="error-codes" className={activeSection === "error-codes" ? "" : "hidden"}>
          <QuickErrorCodes />
        </section>

        <section id="best-practices" className={activeSection === "best-practices" ? "" : "hidden"}>
          <QuickBestPractices />
        </section>

        {/* Subscribers API */}
        <section id="subscribers-get" className={activeSection === "subscribers-get" ? "" : "hidden"}>
          <SubscribersGet />
        </section>

        <section id="subscribers-post" className={activeSection === "subscribers-post" ? "" : "hidden"}>
          <SubscribersPost />
        </section>

        <section id="subscribers-delete" className={activeSection === "subscribers-delete" ? "" : "hidden"}>
          <SubscribersDelete />
        </section>

        {/* Newsletters API */}
        <section id="newsletters-get" className={activeSection === "newsletters-get" ? "" : "hidden"}>
          <NewslettersGet />
        </section>

        <section id="newsletters-post" className={activeSection === "newsletters-post" ? "" : "hidden"}>
          <NewslettersPost />
        </section>
      </div>
    </main>
  )
}

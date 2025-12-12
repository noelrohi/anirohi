import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Legal
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
            <p>
              Your privacy is important to us. This privacy policy explains what
              information we collect and how we use it.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Information We Collect
            </h2>
            <p>
              Anirohi collects minimal information necessary to provide the
              service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground/80">Usage Data:</strong> We
                may collect information about how you access and use the
                service, including your browser type, pages visited, and time
                spent on pages.
              </li>
              <li>
                <strong className="text-foreground/80">
                  Local Storage Data:
                </strong>{" "}
                We store your preferences and watch history locally on your
                device.
              </li>
            </ul>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the service</li>
              <li>Improve user experience</li>
              <li>Monitor usage patterns to optimize performance</li>
            </ul>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Cookies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our service and store certain information. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Third-Party Services
            </h2>
            <p>
              Our service may contain links to third-party websites and
              services. We have no control over and assume no responsibility for
              the content, privacy policies, or practices of any third-party
              sites or services.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us through our contact page.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

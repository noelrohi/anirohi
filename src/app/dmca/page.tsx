import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Legal
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-8">
            DMCA Policy
          </h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
            <p>
              Anirohi respects the intellectual property rights of others and
              expects users of the service to do the same. In accordance with
              the Digital Millennium Copyright Act of 1998, we will respond
              expeditiously to claims of copyright infringement.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Filing a DMCA Notice
            </h2>
            <p>
              If you believe that your copyrighted work has been copied in a way
              that constitutes copyright infringement, please provide our
              designated agent with the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                A physical or electronic signature of a person authorized to act
                on behalf of the owner of the copyright interest
              </li>
              <li>
                A description of the copyrighted work that you claim has been
                infringed
              </li>
              <li>
                A description of where the material you claim is infringing is
                located on the site
              </li>
              <li>Your address, telephone number, and email address</li>
              <li>
                A statement by you that you have a good faith belief that the
                disputed use is not authorized
              </li>
              <li>
                A statement by you, made under penalty of perjury, that the
                above information is accurate
              </li>
            </ul>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Disclaimer
            </h2>
            <p>
              Anirohi does not host any content on its servers. All media is
              provided by third-party services. We are not responsible for any
              content linked to or referred to from this site. If you have any
              legal issues, please contact the appropriate media file owners or
              hosting providers directly.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Contact
            </h2>
            <p>
              To file a DMCA notice, please contact us through our contact page
              with the subject line &quot;DMCA Notice&quot;.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

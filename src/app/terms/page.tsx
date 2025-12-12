import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Legal
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
            <p>
              By accessing and using Anirohi, you accept and agree to be bound
              by the terms and provisions of this agreement.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Use License
            </h2>
            <p>
              Permission is granted to temporarily use this website for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on the website
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Disclaimer
            </h2>
            <p>
              The materials on Anirohi are provided on an &apos;as is&apos;
              basis. Anirohi makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Content
            </h2>
            <p>
              Anirohi does not host any video content. All videos are hosted by
              third-party services. We are not responsible for the content,
              accuracy, or opinions expressed on such websites. Such links
              should not be interpreted as endorsement by us of those linked
              websites.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Limitations
            </h2>
            <p>
              In no event shall Anirohi or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit) arising out of the use or inability to use the
              materials on this website.
            </p>

            <h2 className="text-lg font-medium text-foreground mt-8 mb-4">
              Modifications
            </h2>
            <p>
              Anirohi may revise these terms of service at any time without
              notice. By using this website you are agreeing to be bound by the
              then current version of these terms of service.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsOfService() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Terms of Service
            </CardTitle>
            <CardDescription>Last updated: Sept 05, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    1. Acceptance of Terms
                  </h2>
                  <p>
                    By accessing or using the Flex Home service, you agree to be
                    bound by these Terms of Service. If you do not agree to
                    these terms, please do not use our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    2. Description of Service
                  </h2>
                  <p>
                    Flex Home provides a smart home management platform that
                    allows users to control and monitor their connected devices.
                    Our service is subject to change and may be modified at any
                    time without notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    3. User Accounts
                  </h2>
                  <p>
                    To use Flex Home, you must create an account. You are
                    responsible for maintaining the confidentiality of your
                    account information and for all activities that occur under
                    your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">4. Privacy</h2>
                  <p>
                    Your privacy is important to us. Please review our Privacy
                    Policy to understand how we collect, use, and disclose
                    information about you.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    5. User Conduct
                  </h2>
                  <p>
                    You agree not to use the Flex Home service for any unlawful
                    purpose or in any way that could damage, disable,
                    overburden, or impair our servers or networks.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    6. Intellectual Property
                  </h2>
                  <p>
                    All content and materials available through Flex Home,
                    including but not limited to text, graphics, website name,
                    code, images, and logos, are the intellectual property of
                    Flex Home and are protected by applicable copyright and
                    trademark law.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    7. Limitation of Liability
                  </h2>
                  <p>
                    Flex Home shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages resulting from
                    your access to or use of, or inability to access or use, the
                    service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
                  <p>
                    We may terminate or suspend your account and bar access to
                    the service immediately, without prior notice or liability,
                    under our sole discretion, for any reason whatsoever and
                    without limitation.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    9. Governing Law
                  </h2>
                  <p>
                    These Terms shall be governed and construed in accordance
                    with the laws of [Your Jurisdiction], without regard to its
                    conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    10. Changes to Terms
                  </h2>
                  <p>
                    We reserve the right to modify or replace these Terms at any
                    time. It is your responsibility to check these Terms
                    periodically for changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
                  <p>
                    If you have any questions about these Terms, please contact
                    us at support@flexhome.com.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

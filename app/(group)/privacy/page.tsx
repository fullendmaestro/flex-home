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

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <CardDescription>Last updated: Sept 05, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    1. Introduction
                  </h2>
                  <p>
                    Flex Home (&quot;we&quot;, &quot;our&quot;, or
                    &quot;us&quot;) is committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your information when you use our smart home
                    management service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    2. Information We Collect
                  </h2>
                  <p>
                    We collect information that you provide directly to us, such
                    as when you create an account, configure your devices, or
                    contact our support team. This may include:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Personal information (e.g., name, email address, phone
                      number)
                    </li>
                    <li>
                      Device information (e.g., device types, settings, usage
                      data)
                    </li>
                    <li>Location data (with your consent)</li>
                    <li>
                      Payment information (processed securely by our payment
                      providers)
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    3. How We Use Your Information
                  </h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>
                      Send you technical notices, updates, security alerts, and
                      support messages
                    </li>
                    <li>
                      Respond to your comments, questions, and customer service
                      requests
                    </li>
                    <li>Develop new products and services</li>
                    <li>
                      Monitor and analyze trends, usage, and activities in
                      connection with our services
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    4. Sharing of Information
                  </h2>
                  <p>
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>With your consent</li>
                    <li>
                      With third-party vendors, consultants, and other service
                      providers who need access to such information to carry out
                      work on our behalf
                    </li>
                    <li>
                      In response to a request for information if we believe
                      disclosure is in accordance with, or required by, any
                      applicable law or legal process
                    </li>
                    <li>
                      If we believe your actions are inconsistent with our user
                      agreements or policies, or to protect the rights,
                      property, and safety of Flex Home or others
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    5. Data Security
                  </h2>
                  <p>
                    We take reasonable measures to help protect information
                    about you from loss, theft, misuse, unauthorized access,
                    disclosure, alteration, and destruction. However, no
                    internet or electronic storage system is 100% secure, and we
                    cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    6. Your Choices
                  </h2>
                  <p>
                    You can manage your information and privacy settings by:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Updating your account information</li>
                    <li>
                      Adjusting your privacy settings within the Flex Home app
                    </li>
                    <li>Opting out of promotional communications</li>
                    <li>Requesting deletion of your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    7. Children&apos;s Privacy
                  </h2>
                  <p>
                    Our services are not intended for children under 13 years of
                    age, and we do not knowingly collect personal information
                    from children under 13.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    8. Changes to this Privacy Policy
                  </h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the &quot;Last updated&quot; date
                    at the top of this policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please
                    contact us at privacy@flexhome.com.
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

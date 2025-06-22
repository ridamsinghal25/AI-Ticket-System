import { NonRetriableError } from "inngest";
import User from "../../models/user.js";
import { sendMail } from "../../utils/mailer.js";
import { inngest } from "../client.js";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      console.log("email in inngest", email);

      console.log("I have received an event", event);
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });

        if (!userObject) {
          throw new NonRetriableError("User no longer exists in database");
        }

        return userObject;
      });

      console.log("User found", user);

      await step.run("send-welcome-email", async () => {
        const subject = `Welcome to the app`;
        const message = `Hi,
            \n\n
            Thanks for signing up. We're glad to have you onboard!
            `;
        console.log("mail send");
        await sendMail(user.email, subject, message);
      });

      console.log("Notification sent");
      return { success: true };
    } catch (error) {
      console.error("❌ Error running step", error.message);

      return { success: false };
    }
  }
);

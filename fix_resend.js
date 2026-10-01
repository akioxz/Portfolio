const fs = require('fs');
const path = './app/api/contact/route.ts';
let content = fs.readFileSync(path, 'utf8');

const regex = /const autoReplyPromise = resend\.emails\.send\(\{[\s\S]*?if \(autoReplyResult\.status === "rejected"\) \{[\s\S]*?\}\n/m;
const replacement = `const notificationResult = await notificationPromise;
    
    if (notificationResult.error) {
      console.error("[Resend Notification Failed]", notificationResult.error);
      return NextResponse.json(
        { error: "Failed to send notification email. Please try emailing me directly at dev.akioxz@gmail.com instead." },
        { status: 500 }
      );
    }
`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content, 'utf8');
console.log("Done");

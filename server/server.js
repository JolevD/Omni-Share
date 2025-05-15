import express from "express";
import cors from "cors"
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ngrok from 'ngrok';
import helmet from "helmet"
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(crypto.randomBytes(16)).toString("base64");
    next();
}); // creates a nonce value

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`], // Only allow scripts with this nonce
            },
        },
    })
);
// its a security middleware which prevents our app from different attacks, hides the express default origin headers
app.use(cors())

app.use(express.json())
const PORT = 3000


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


let isSharing = false;
let sharedFile = '';  // Stores the full file path
let fileName = '';     // Stores just the filename
let publicUrl = '';
let isConfirmed = false;


// app.post("/api/status", (req, res) => {
//     res.json({
//         isSharing,
//         sharedDirectory,
//         publicUrl
//     })
// })


app.post("/api/start", async (req, res) => {

    try {
        // receiving the filepath
        const { filePath } = req.body

        // checking if file path is missing
        if (!filePath) {
            return res.status(400).json({ message: "File path is required" })
        }

        // checking if there is already a process active or not
        if (isSharing) {
            return res.json("another process in progress")
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File does not exist" });
        }
        // setting filepath
        fileName = path.basename(filePath);
        sharedFile = filePath;
        isConfirmed = false;

        // app.use('/shared', express.static(sharedDirectory));  we are not using this here because with every request a new middleware will be added

        // creating tunnel for generating public url and qrcode
        const tunnelUrl = await ngrok.connect({
            addr: PORT,
            authtoken: process.env.NGROK_AUTH_TOKEN,
            configPath: path.join(__dirname, 'ngrok.yml')
        });

        // tunnel = tunnelResponse

        publicUrl = `${tunnelUrl}/receive?file=${encodeURIComponent(fileName)}`;    //

        const qrCodeData = await QRCode.toDataURL(publicUrl);

        isSharing = true

        setTimeout(() => {
            if (!isConfirmed && isSharing) {
                // Optionally notify the sender or log the timeout event
                // Then shut down the tunnel and reset state
                ngrok.disconnect();
                ngrok.kill();
                isSharing = false;
                sharedFile = ''
                publicUrl = '';
                console.log("Sharing session timed out due to lack of confirmation.");
            }
        }, 10 * 60 * 1000); // 10 minutes

        res.status(200).json({ message: "File is sharing", publicUrl, qrCodeData });

    } catch (error) {

        console.log(error.message);

        res.status(400).json("Failed to start sharing")
    }

})


app.get('/receive', (req, res) => {
    // Extract the file name from the query parameter
    const fileName = req.query.file || 'unknown';
    // Render the confirm.ejs template and pass the fileName variable to it
    res.render('confirm', { fileName });
});


app.post('/api/confirm', (req, res) => {

    //checking if there is process active or not
    console.log("confirm page hit")
    if (!isSharing) {
        return res.status(400).json({ message: "No active sharing session" });
    }

    // setting confirmation from the receiver 
    isConfirmed = true

    res.status(200).json({ message: "Receiver confirmed. File transfer authorized." });

})



app.get('/api/stream', (req, res) => {

    const requestedFile = req.query.file

    if (!isConfirmed) {
        res.status(404).json({ message: "Confirmation required" })
    }

    if (!requestedFile) {
        res.status(404).json({ message: "File is missing" })
    }

    //revise this part
    // In our current setup, sharedFile holds the full path of the file selected by the sender.
    // We assume that requestedFile matches fileName from the /api/start process.
    if (!fs.existsSync(sharedFile)) {
        return res.status(404).json({ message: "File not found." });
    }
    console.log("sending file");
    // Set headers to trigger a download (or display inline, depending on file type and browser)
    res.setHeader("Content-Disposition", `attachment; filename="${requestedFile}"`); // “Download This File” 
    res.setHeader("Content-Type", "application/octet-stream") // “The file is binary data” 

    // Create a read stream and pipe it to the response.
    const fileStream = fs.createReadStream(sharedFile);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (err) => {
        console.error("Error reading the file:", err);
        res.status(500).json({ message: "Error streaming the file." });
    });
});


app.post("/api/stop", async (req, res) => {
    try {
        if (isSharing) {
            await ngrok.disconnect();
            await ngrok.kill();
            isSharing = false;
            sharedFile = "";  // corrected from sharedDirectory to sharedFile
            publicUrl = "";
            return res.status(200).json({ message: "Sharing stopped" });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "No active sharing session" });
    }

});


// app.get("/api/files", (req, res) => {

// })


app.listen(PORT, '0.0.0.0', () => {
    console.log(`app running on port: ${PORT}`)
})
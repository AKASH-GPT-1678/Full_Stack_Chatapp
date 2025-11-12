import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();
const encodedMessage = `ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZmxlZXRvcHMt
NDY0MDA4IiwKICAicHJpdmF0ZV9rZXlfaWQiOiAiZTRlNmY5NGI5ZGExNGExNDE4ZWM1MDA2ZGM5
ZDg3NmM3Mzg0MDhiZiIsCiAgInByaXZhdGVfa2V5IjogIi0tLS0tQkVHSU4gUFJJVkFURSBLRVkt
LS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFD
MkNMYUYwb1JyU1RkQVxuZ0pWQ3cwQlR0TGN0TFh3U1p4Rk9ScndPL1VUeElqUlAwWmx0Vi9PUkhj
VHV0US9vTmh1ekRZYWhqeEVKSEFCU1xuRDlVR1l6QTJtSzJOTEh1SnNTY0JLaFFsNnZZZWh5MU5Z
Mkp2N1U2QTRnSS93ZEpHbzZTV3U1QStyMWxQbDZLOFxub2M3TmQwdmdiMFNzQjlGRHdUSXp4T0d0
WUVNMVlUQjRlRzlCbFRQaEt2ZXVFM0JPd1piRmZ5MWJHL2dXOEthelxudS9xZHlvRHhwUi9md0tJ
VkRwNFdzWnJzMG1UTzVTbVR1TzRyTDlyT2VkRWd1c2NUVEM4R1c1V1BuUzVIMlMwcVxuYllLUm45
bW1hQnB2N2lsZW1XWWpvNXMxYm9jUHlLOUtUdlFFL1F4VHZzOXdLMmFDTlZTOVhaYUFNQWJCYmxv
eFxuelNDNnhUa3RBZ01CQUFFQ2dnRUFCZW1yQ2haQU5GN3NzMFRwOUVEMDJETTB4dndrL1ZFSlBC
NXFrZDhTcS9WMVxuTndtREh3emVEYjdtakcxbnJwNkJVRlBXWlcySSsxK0VPQ1lwQUh2Y3owMHV4
L2pqcTJHTWQ0cDNISk13K3VWZlxucUpXYmx6Q2hYZWpaYzFvM214RktNWlkybFg2ckd6MTg3UDBo
ZzBXR2Vxd0trajd2d25CbVVjMnBtZkRZUmdYTFxueWZ0ZlVOb0IyU2hHZWZzcEhqWkVGS3hQVVpl
amVLbCtBVEQySG02UjhOUG00MWZzQUNhK2JTRFRwVVNUQUZ3bFxuaEo3NGtwSjFsSTdudURsZkw5
Y3Q5eW1FOGJ6Z2YwOGI1YlIvZ0NaTFZtdTJoUVV2NjkxTTM5OGU2Z0xYNzFkbVxuL2xTaHBWVWV3
NFhDZ1loRHFHb3haNzZiN08wQkh1bm9rdWhLRE1vbzBRS0JnUUR4RUFGZ0NQK280YldITmgwK1xu
ZzIvVE55VHN4MTk0UkVRWXdlR2Jnc0ZZSVErNERRcXZYeTJTbDY0SDFWU3h4S2x2VDIrU2ErN05u
VUxxWmNoclxudE40VVkrdlVKOEFWOGM3M2RZWk5DZmEycjYyenVyZnJnd1RhMnlZdW5kNEJRWTFr
cDNiMWpGWHJjbzk1cno1aFxuQ0dwdkEzcm5UQVU4WjFRdXdzb3RWMmRRa1FLQmdRREJVRlY0dUll
LzFPY0pqb1lTWEtwam9KVzRrNThIUWdIeVxucTB1bHpPQUwzL2N1QW1xQk5UUUxQYTdvNmkvek5L
cXVQU0hyb1l2azM1N3psUldhY3V1T2pYUUt1MzZwK2dlS1xuRDJrQTFza0pZZzE2RWt3THBNYWlE
U3hPUGJOWURodStXMVhKZ0hlOExSaGN1VG9WaWV6VTlTUWRVNEM5VUZQbFxuS2k0Wk90L3MzUUtC
Z0YrRGR2Z0ZPTDlDaHptR3dIbVhmSVJVMGlXYkxZR3Frc3k0YlZxL3FUbnhCNWhtV25oNFxuSHNk
NW4vUHNtLzAvcmQ2enU4SnBUNXBhbUR2bGprN1d3RE9XRDhmazVDQU55bktVTjExbytEOFVScC95
K0pLeFxuUEFnM1V0NmZvR29nL2hRR29vVFNVT3pVWEhMYmM3emdwOE5LdnJUTWt6cUd1bjA0b3dE
cUk3NXhBb0dCQUlXZVxuOWJXQU43VU5nTFZHWXI0R2QzQnQ2NCt0MmxxMThZcS9oSWFTV3J0YWtB
eXBkdHpnM1p4M2dwTlViTmg3S3c5TlxuQ2tsSlhOMVRCUmZ4a1FFMU5rVk8yVXNoMXFlL1A3N2Fj
QVk0Y0xXZnBSa2YxSmlueVBUeWpoRjI3S1NNKy9oVVxuUWJRS3JMalJvdWxVenlWY05PdnVsb3Yr
MEJvTGtESHpPZklPbEFHeEFvR0FCYWhnUVUyQ1hKeGwzK05SSGdVNFxuVEhHeWMxcU9TTzI2OHlk
TTkwdWVWTTZTUUVQM2ZXUHR0QU5jODZ0MUR0MGVtT1lkN3JpaThnTjNaUzZqaDdUZ1xuSVpZVnBp
czRRUGtvSk9BbWtPYXhmTnc5c29Na1V2VG95MHRneU1RQUlmQ29leG41d3lxYldHS08xQUY5NkI0
QlxuWUFFM29wR2YreDlwM2o0Q3JPaWJNMHM9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4i
LAogICJjbGllbnRfZW1haWwiOiAiZ3VwdGEtbWFuYWdlckBmbGVldG9wcy00NjQwMDguaWFtLmdz
ZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTEzNTYwNTgxMDI4MzQ4MDUzNTA0
IiwKICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1
dGgiLAogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4i
LAogICJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBp
cy5jb20vb2F1dGgyL3YxL2NlcnRzIiwKICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6
Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9ndXB0YS1tYW5hZ2Vy
JTQwZmxlZXRvcHMtNDY0MDA4LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAidW5pdmVyc2Vf
ZG9tYWluIjogImdvb2dsZWFwaXMuY29tIgp9Cg==`
function initializeStorage() {
    let storage;
    console.log("NODE_ENV:", process.env.NODE_ENV);

    if (process.env.NODE_ENV === "development") {
        // Local development: use service account file
        if (!process.env.PROJECT_ID) {
            throw new Error("❌ PROJECT_ID not set in .env for development");
        }

        storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: "fleetops-464008-e4e6f94b9da1.json",
        });

    } else {

        const trailEncoded = process.env.GCP_CREDENTIALS;
        console.log("trailEncoded:", trailEncoded);
        const encoded = encodedMessage;
        if (!encoded) {
            throw new Error("❌ GCP_CREDENTIALS not set in environment variables");
        }

        let credentials;
        try {
            credentials = JSON.parse(
                Buffer.from(encoded, "base64").toString("utf-8")
            );
        } catch (err) {
            throw new Error("❌ Failed to parse GCP_CREDENTIALS: " + err.message);
        }

        storage = new Storage({
            projectId: credentials.project_id,
            credentials,
        });
    }

    return storage;
}

const storage = initializeStorage();
export default storage;

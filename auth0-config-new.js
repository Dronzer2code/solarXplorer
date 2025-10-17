// Auth0 Configuration and Authentication Logic
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize Auth0 using our manager
    await authManager.initialize();
    console.log("🚀 Auth0 client initialized successfully");
    console.log("📍 Redirect URI:", authManager.redirectUri);

    // Handle authentication state on page load
    if (location.search.includes("state=") && 
        (location.search.includes("code=") || 
        location.search.includes("error="))) {
      try {
        await authManager.handleRedirectCallback();
        console.log("✅ Authentication callback handled");
      } catch (error) {
        console.error("❌ Auth callback error:", error);
      }
    }

    // Check authentication status and update UI
    await updateAuthUI();

    // Authentication UI update function
    async function updateAuthUI() {
      try {
        const isAuthenticated = await authManager.isAuthenticated();
        const user = await authManager.getUser();

        // Get UI elements
        const loginButton = document.getElementById("login-btn");
        const logoutButton = document.getElementById("logout-btn");
        const userProfileElement = document.getElementById("user-profile");

        if (isAuthenticated && user) {
          // User is logged in
          console.log("👤 User authenticated:", user.name);
          
          if (loginButton) loginButton.style.display = "none";
          if (logoutButton) logoutButton.style.display = "inline-block";
          
          if (userProfileElement) {
            userProfileElement.style.display = "flex";
            userProfileElement.innerHTML = `
              <div class="user-info">
                <img src="${user.picture}" alt="Profile" class="user-avatar">
                <div class="user-details">
                  <span class="user-name">${user.name}</span>
                  <span class="user-email">${user.email || ''}</span>
                </div>
              </div>
            `;
          }

          // Show authenticated content
          showAuthenticatedContent();
          
          // Update CTA buttons for authenticated user
          updateCTAButtons(true);
          
        } else {
          // User is not logged in
          console.log("🔒 User not authenticated");
          
          if (loginButton) loginButton.style.display = "inline-block";
          if (logoutButton) logoutButton.style.display = "none";
          if (userProfileElement) userProfileElement.style.display = "none";
          
          // Hide authenticated content
          hideAuthenticatedContent();
          
          // Update CTA buttons for unauthenticated user
          updateCTAButtons(false);
        }
      } catch (error) {
        console.error("❌ Error updating auth UI:", error);
      }
    }

    // Login event handler for fingerprint button
    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
      console.log("✅ Fingerprint login button found and initializing...");
      
      loginButton.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("🖐️ Fingerprint button clicked!");
        
        // Trigger fingerprint animation
        loginButton.classList.add('active');
        console.log("🎬 Animation started...");
        
        // Wait for animation to complete before redirecting
        setTimeout(async () => {
          console.log("🔑 Initiating Auth0 login...");
          await authManager.login();
        }, 4100); // Wait for fingerprint scan animation to complete (4.1 seconds)
      });
      
      // Reset animation when it ends
      loginButton.addEventListener('animationend', () => {
        console.log("🎬 Animation ended, resetting...");
        loginButton.classList.remove('active');
      });
    } else {
      console.error("❌ Fingerprint login button not found!");
    }

    // Logout event handler
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
      console.log("✅ Fingerprint logout button found and initializing...");
      
      logoutButton.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("👋 Fingerprint logout button clicked!");
        console.log("👋 Initiating Auth0 logout...");
        await authManager.logout();
      });
    } else {
      console.error("❌ Fingerprint logout button not found!");
    }

    // Show/hide content based on authentication
    function showAuthenticatedContent() {
      const protectedElements = document.querySelectorAll('.auth-protected');
      protectedElements.forEach(el => el.style.display = 'block');
      
      const publicElements = document.querySelectorAll('.auth-public');
      publicElements.forEach(el => el.style.display = 'none');
    }

    function hideAuthenticatedContent() {
      const protectedElements = document.querySelectorAll('.auth-protected');
      protectedElements.forEach(el => el.style.display = 'none');
      
      const publicElements = document.querySelectorAll('.auth-public');
      publicElements.forEach(el => el.style.display = 'block');
    }

    // Update CTA buttons based on authentication status
    function updateCTAButtons(isAuthenticated) {
      const mainCTA = document.getElementById("main-cta");
      const finalCTA = document.getElementById("final-cta-button");
      
      if (isAuthenticated) {
        // User is logged in - show "Enter Solar System" text and link to Vercel
        if (mainCTA) {
          mainCTA.innerHTML = '> ENTER SOLAR SYSTEM <';
          mainCTA.title = 'Launch the 3D Solar System Explorer';
        }
        if (finalCTA) {
          finalCTA.innerHTML = '> ENTER SOLAR SYSTEM <';
          finalCTA.title = 'Launch the 3D Solar System Explorer';
        }
      } else {
        // User is not logged in - show "Login to Explore" text
        if (mainCTA) {
          mainCTA.innerHTML = '> LOGIN TO EXPLORE <';
          mainCTA.title = 'Sign in to access the Solar System';
        }
        if (finalCTA) {
          finalCTA.innerHTML = '> LOGIN TO EXPLORE <';
          finalCTA.title = 'Sign in to access the Solar System';
        }
      }
    }

    // Make functions globally available
    window.authManager = authManager;
    window.updateAuthUI = updateAuthUI;
    window.updateCTAButtons = updateCTAButtons;

  } catch (error) {
    console.error("❌ Failed to initialize Auth0:", error);
    
    // Fallback behavior when Auth0 fails
    const mainCTA = document.getElementById("main-cta");
    const finalCTA = document.getElementById("final-cta-button");
    
    if (mainCTA) {
      mainCTA.innerHTML = '> ENTER SOLAR SYSTEM <';
      mainCTA.onclick = () => window.open("https://3d-solar-system-three-js.vercel.app/", "_blank");
    }
    if (finalCTA) {
      finalCTA.innerHTML = '> ENTER SOLAR SYSTEM <';
      finalCTA.onclick = () => window.open("https://3d-solar-system-three-js.vercel.app/", "_blank");
    }
  }
});

// Global function to handle main CTA button clicks
async function handleMainCTA() {
  try {
    if (window.authManager && window.authManager.isInitialized) {
      const isAuthenticated = await window.authManager.isAuthenticated();
      
      if (isAuthenticated) {
        // User is logged in - redirect to Vercel page
        console.log("🚀 Redirecting authenticated user to Solar System");
        window.open("https://3d-solar-system-three-js.vercel.app/", "_blank");
      } else {
        // User is not logged in - trigger login
        console.log("🔑 Redirecting to login for authentication");
        await window.authManager.login();
      }
    } else {
      // Auth0 not initialized yet - fallback to direct link
      console.log("⚠️ Auth0 not ready, opening direct link");
      window.open("https://3d-solar-system-three-js.vercel.app/", "_blank");
    }
  } catch (error) {
    console.error("❌ CTA handler error:", error);
    // Fallback to direct link on error
    window.open("https://3d-solar-system-three-js.vercel.app/", "_blank");
  }
}

// Make function globally available
window.handleMainCTA = handleMainCTA;
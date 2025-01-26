document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-overlay form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const formData = {
            email: document.querySelector("#login-email").value,
            password: document.querySelector("#login-password").value,
        };

        try {
            // Send a POST request to the backend for login
            const response = await fetch("http://localhost:3000/api/login", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // Parse response
            const responseData = await response.json();

            if (!response.ok) {
                // Display validation or server error messages
                if (responseData.errors) {
                    // Display validation errors with SweetAlert2
                    const errorMessages = responseData.errors.map(error => error.message).join("\n- ");
                    Swal.fire({
                        title: 'Validation Errors',
                        text: errorMessages,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#1A73E8'
                    });
                } else if (responseData.error) {
                    Swal.fire({
                        title: 'Error',
                        text: responseData.error,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#1A73E8'
                    });
                } else {
                    Swal.fire({
                        title: 'Unknown Error',
                        text: "An unknown error occurred. Please try again.",
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#1A73E8'
                    });
                }
                return;
            }

            // Save the JWT token and user role in local storage
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("userRole", responseData.user.role);
            localStorage.setItem("userId", responseData.user.id);


            // Display success message using SweetAlert2
            Swal.fire({
                title: 'Success!',
                text: responseData.message || "Login successful!",
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1A73E8'
            }).then(() => {
                // Reset the form fields after success
                loginForm.reset();

                // Close the login overlay
                toggleOverlay('login');

                // Redirect based on user role
                const userRole = responseData.user.role;
                if (userRole === 'admin') {
                    window.location.href = "admindashboard.html"; // Redirect to admin page
                } else if (userRole === 'user') {
                    window.location.href = "index.html"; // Redirect to user page
                } else {
                    window.location.href = "index.html"; // Default redirect if role is unknown
                }
            });
        } catch (error) {
            console.error("Error during login:", error);
            Swal.fire({
                title: 'Unexpected Error',
                text: "An unexpected error occurred. Please try again later.",
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1A73E8'
            });
        }
    });
});
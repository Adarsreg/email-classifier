
const fetchEmails = async (sessionToken: string| undefined , count: number=10) => {

    //console.log("Access token to be sent", sessionToken)
    try {
        const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${count}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
                'Accept': 'application/json'
            },
        });
      
        if (!response.ok) {
            throw new Error('Failed to fetch emails');
        }
        
        const emails = await response.json();
        console.log("1st response",emails)

        // Fetch detailed information for each email
        const emailDetails = await Promise.all(
            emails.messages.map(async (message: { id: string }) => {
                const emailResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`,
                        'Accept': 'application/json'
                    },
                });

                if (!emailResponse.ok) {
                    throw new Error(`Failed to fetch email with ID: ${message.id}`);
                }

                return await emailResponse.json();
            })
        );
        
        //console.log("Email further...",emailDetails);

        // const fullEmails = emailDetails.map(email => {
        //     const payload = email.payload;
        //     const parts = payload.parts;
        //     let emailBody = '';

        //     if(parts){
        //         parts.forEach(part =>{
        //             if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        //                 const bodyData = part.body.data;
        //                 if (bodyData) {
        //                     emailBody += atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'));
        //                 }
        //             }
        //         });
        //     } else{
        //         const bodyData = payload.body.data;
        //         if (bodyData) {
        //             emailBody = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'));
        //         }
        //     }
        //     return {
        //         ...email,
        //         body: emailBody
        //     };
        // })
        // return fullEmails;

        return emailDetails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
};

export default fetchEmails;
export interface GmailEmail {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  payload: {
    headers: {
      name: string
      value: string
    }[]
    parts?: {
      mimeType: string
      body: {
        data?: string
      }
    }[]
    body?: {
      data?: string
    }
  }
  internalDate: string
}

export interface EmailData {
  id: string
  threadId: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  content: string
  time: string
  date: string
  read: boolean
  starred: boolean
  avatar: string
  category: string
  hasAttachment: boolean
  attachments?: {
    name: string
    size: string
    type: string
  }[]
}

export async function fetchEmails(accessToken: string, maxResults = 20): Promise<EmailData[]> {
  try {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${response.statusText}`)
    }

    const data = await response.json()
    const emailIds = data.messages.map((message: { id: string }) => message.id)

    // Fetch details for each email
    const emailPromises = emailIds.map((id: string) => fetchEmailDetails(id, accessToken))
    const emails = await Promise.all(emailPromises)

    return emails
  } catch (error) {
    console.error("Error fetching emails:", error)
    return []
  }
}

export async function fetchEmailDetails(id: string, accessToken: string): Promise<EmailData> {
  try {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch email details: ${response.statusText}`)
    }

    const email: GmailEmail = await response.json()

    // Parse email data
    const headers = email.payload.headers
    const sender = headers.find((h) => h.name === "From")?.value || ""
    const subject = headers.find((h) => h.name === "Subject")?.value || ""
    const date = headers.find((h) => h.name === "Date")?.value || ""

    // Extract sender name and email
    const senderMatch = sender.match(/^(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)$/)
    const senderName = senderMatch ? senderMatch[1] || senderMatch[2] : sender
    const senderEmail = senderMatch ? senderMatch[2] : ""

    // Get avatar initials
    const avatarInitials = senderName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    // Parse date
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString()
    const formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Check if email is read
    const isUnread = email.labelIds.includes("UNREAD")

    // Check if email is starred
    const isStarred = email.labelIds.includes("STARRED")

    // Determine category
    let category = "primary"
    if (email.labelIds.includes("CATEGORY_SOCIAL")) category = "social"
    if (email.labelIds.includes("CATEGORY_PROMOTIONS")) category = "promotions"
    if (email.labelIds.includes("CATEGORY_UPDATES")) category = "updates"
    if (email.labelIds.includes("CATEGORY_FORUMS")) category = "forums"

    // Check for attachments
    const hasAttachment = email.labelIds.includes("HAS_ATTACHMENT")

    // Extract content
    let content = ""
    if (email.payload.parts) {
      const textPart = email.payload.parts.find(
        (part) => part.mimeType === "text/html" || part.mimeType === "text/plain",
      )
      if (textPart && textPart.body.data) {
        content = decodeBase64(textPart.body.data)
      }
    } else if (email.payload.body && email.payload.body.data) {
      content = decodeBase64(email.payload.body.data)
    }

    return {
      id: email.id,
      threadId: email.threadId,
      sender: senderName,
      senderEmail,
      subject,
      preview: email.snippet,
      content,
      time: formattedTime,
      date: formattedDate,
      read: !isUnread,
      starred: isStarred,
      avatar: avatarInitials,
      category,
      hasAttachment,
    }
  } catch (error) {
    console.error(`Error fetching email ${id}:`, error)
    return {
      id,
      threadId: "",
      sender: "Error",
      senderEmail: "",
      subject: "Could not load email",
      preview: "There was an error loading this email.",
      content: "",
      time: "",
      date: "",
      read: true,
      starred: false,
      avatar: "ER",
      category: "primary",
      hasAttachment: false,
    }
  }
}

export async function sendEmail(accessToken: string, to: string, subject: string, body: string): Promise<boolean> {
  try {
    const emailContent = [
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\r\n")

    const encodedEmail = btoa(emailContent).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export async function deleteEmail(accessToken: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}/trash`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error(`Error deleting email ${id}:`, error)
    return false
  }
}

export async function markAsRead(accessToken: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        removeLabelIds: ["UNREAD"],
      }),
    })

    return response.ok
  } catch (error) {
    console.error(`Error marking email ${id} as read:`, error)
    return false
  }
}

export async function toggleStar(accessToken: string, id: string, starred: boolean): Promise<boolean> {
  try {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addLabelIds: starred ? [] : ["STARRED"],
        removeLabelIds: starred ? ["STARRED"] : [],
      }),
    })

    return response.ok
  } catch (error) {
    console.error(`Error toggling star for email ${id}:`, error)
    return false
  }
}

// Helper function to decode base64 encoded content
function decodeBase64(data: string) {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return rawData
}

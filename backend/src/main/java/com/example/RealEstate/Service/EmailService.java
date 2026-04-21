package com.example.RealEstate.Service;

import com.example.RealEstate.Model.Enquiry;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public void sendEnquiryToOwner(Enquiry enquiry) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(enquiry.getOwnerEmail());
        message.setSubject("New enquiry for " + enquiry.getPropertyTitle());
        message.setText(buildOwnerMessage(enquiry));
        mailSender.send(message);
    }

    private String buildOwnerMessage(Enquiry enquiry) {
        return "You have received a new enquiry for your property.\n\n"
                + "Property: " + enquiry.getPropertyTitle() + "\n"
                + "Buyer Name: " + enquiry.getBuyerName() + "\n"
                + "Buyer Email: " + enquiry.getBuyerEmail() + "\n"
                + "Buyer Phone: " + (enquiry.getBuyerPhone() == null ? "N/A" : enquiry.getBuyerPhone()) + "\n\n"
                + "Message:\n" + enquiry.getMessage();
    }
}

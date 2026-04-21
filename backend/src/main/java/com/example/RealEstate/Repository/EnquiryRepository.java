package com.example.RealEstate.Repository;

import com.example.RealEstate.Model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
}

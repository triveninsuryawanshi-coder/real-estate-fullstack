package com.example.RealEstate.Repository;

import com.example.RealEstate.Enum.ListingType;
import com.example.RealEstate.Model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> , JpaSpecificationExecutor<Property> {
   List<Property> findByOwner_UserId(Long ownerId);

    Page<Property> findByCityIgnoreCaseAndListingType(String city, ListingType listingType, Pageable pageable);
}

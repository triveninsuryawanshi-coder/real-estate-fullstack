package com.example.RealEstate.Controller;

import com.example.RealEstate.Enum.ListingType;
import com.example.RealEstate.Enum.PropertyType;
import com.example.RealEstate.Model.Property;
import com.example.RealEstate.Service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Locale;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<Page<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String listingType,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) Integer bhk,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea,
            @RequestParam(required = false) String furnishing,
            @RequestParam(required = false) String parking,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        ListingType normalizedListingType = parseListingType(listingType);
        Page<Property> result = propertyService.searchProperties(
                city,
                normalizedListingType,
                type,
                bhk,
                bathrooms,
                minPrice,
                maxPrice,
                minArea,
                maxArea,
                furnishing,
                parking,
                sortBy,
                sortDir,
                page,
                size
        );

        return ResponseEntity.ok(result);
    }

    private ListingType parseListingType(String listingType) {
        if (listingType == null || listingType.isBlank()) {
            return null;
        }

        String normalizedValue = listingType.trim().toUpperCase(Locale.ROOT);
        if ("BUY".equals(normalizedValue)) {
            return ListingType.SELL;
        }

        return ListingType.valueOf(normalizedValue);
    }
}

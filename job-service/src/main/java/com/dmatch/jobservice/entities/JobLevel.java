package com.dmatch.jobservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;
}

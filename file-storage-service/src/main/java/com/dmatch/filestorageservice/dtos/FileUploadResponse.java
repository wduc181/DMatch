package com.dmatch.filestorageservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {

     @JsonProperty("file_name")
     private String fileName;

     @JsonProperty("file_key")
     private String fileKey;

     @JsonProperty("file_type")
     private String fileType;

     @JsonProperty("file_size")
     private Long fileSize;
}

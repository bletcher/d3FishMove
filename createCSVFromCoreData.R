library(dplyr)

# coreData created in the qualitativeMovement project on Osensei
load('coreData')

out <- cd %>%
         filter(year %in% 2002:2003 &  riverOrdered == "IL") %>%
         mutate( tagFactor = as.numeric(factor(tag))) %>%
         select( date = detectionDate, id = tagFactor, section = section, len = observedLength, river=riverOrdered )

write.csv(out,file='coreDataOut.csv', row.names = F)
str(out)

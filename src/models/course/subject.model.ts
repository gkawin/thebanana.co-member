import { JsonProperty, JsonObject } from 'typescript-json-serializer'

@JsonObject()
export class SubjectModel {
    @JsonProperty()
    title: string

    @JsonProperty()
    seats: number

    @JsonProperty()
    semaster: string
}

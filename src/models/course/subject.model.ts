import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class SubjectModel {
    @JsonProperty()
    title: string

    @JsonProperty()
    seats: number

    @JsonProperty()
    semaster: string
}

# Collection Store Pattern for Vue, Pinia, TypeScript

## Case
An array of objects with mutable data (representing records) in a pinia store.
Each record has read only derived/computed data used by the app. 

## Requirements
Reusable code with the ability to access the computed record data of each record without repeated or unnecessary re-computation of other records in the array.


## Example
This repo implements a trivial reduced case example where the `display_name_length` is the computed length of the `display_name` property. In practice this technique would be used for much more complex data.

```ts
export interface Vehicle {
    readonly id: number;
    display_name: string;
}

export interface VehicleInfo {
    readonly id: number;
    readonly display_name: string;
    readonly display_name_length: number;
}

```

Demo: [https://unstoppablecarl.github.io/vue-pinia-cachable-collection/](https://unstoppablecarl.github.io/vue-pinia-cachable-collection/)
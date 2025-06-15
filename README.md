# Collection Store Pattern for Vue, Pinia, TypeScript

## Case
A Pinia store has an array of objects `items` with mutable data representing records.
Each record has immutable computed data used by multiple components in the app. 

## Requirements
Reusable code with the ability to access the computed record data of each record without repeated or unnecessary re-computation of the record other records in the array.


## Example
This repo implements a trivial reduced case example with the computed properties: `display_name_length` and `display_order`. 

**In practice this technique would be used for much more complex data.**

```ts
export interface Vehicle {
    readonly id: number;
    display_name: string;
}

export interface VehicleInfo {
    readonly id: number;
    readonly display_name: string;
    // computed length of the display_name property
    readonly display_name_len: number;
    // index of this item in the items array
    readonly display_order: number;
}
```

Demo: [https://unstoppablecarl.github.io/vue-pinia-cachable-collection/](https://unstoppablecarl.github.io/vue-pinia-cachable-collection/)
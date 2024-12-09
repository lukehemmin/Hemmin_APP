//
//  Item.swift
//  Hemmin_APP
//
//  Created by lukehemmin on 12/9/24.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}

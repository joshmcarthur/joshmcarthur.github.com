---
layout: post
title: "iOS Action Sheet with Strada"
description: ""
category:
tags: []
---

[Virtualtrails](https://virtualtrails.app) uses [Strada](https://strada.hotwired.dev/) to bridge native iOS code to the web application, including notifications, native Apple + Google Signin and Apple Healthkit integration. I added a feature yesterday to replace a Bootstrap dropdown with a native iOS sheet, just because it’s a more intuitive experience for users.

<div class="card-image">
  <video controls src="/img/posts/sheet.mp4"></video>
</div>

Strada has two parts - the web side (which is in the form of a [Stimulus](https://stimulus.hotwired.dev/) controller with some guards built in so it only runs when Strada’s native side is available), and the iOS side (which is in the form of a ‘component’ which receives ‘messages’ from the web side, and can reply to them).

The Strada Bridge Component is pretty straightforward:

```typescript
import { BridgeComponent, Message } from '@hotwired/strada';
import { Turbo } from '@hotwired/turbo-rails';

interface PresentDropdownNavigationSheetLink {
  text: string;
  url: string;
  style: string;
}

interface PresentDropdownNavigationSheetData {
  selectedLink?: PresentDropdownNavigationSheetLink;
  links: PresentDropdownNavigationSheetLink[];
}

interface PresentDropdownNavigationSheetMessage extends Message {
  data: PresentDropdownNavigationSheetData;
}

export default class DropdownNavigationSheetController extends BridgeComponent {
  public static component = 'dropdown-navigation-sheet';
  public static values = { links: Array };
  private readonly linksValue: PresentDropdownNavigationSheetData[] | undefined;

  public present(e: Event): boolean {
    e.stopImmediatePropagation();

    this.send(
      'present',
      { links: this.linksValue },
      ({ data }: PresentDropdownNavigationSheetMessage) => {
        if (data.selectedLink) {
          Turbo.visit(data.selectedLink.url);
        }
      }
    );

    return false;
  }
}
```

When the ‘present’ [action](https://stimulus.hotwired.dev/reference/actions) is triggered from the element, it sends a ‘present’ message to the iOS component, with the links to present in the action sheet. Each link has text, a URL (most of the time a path in my case), and a style (which maps to the [iOS action sheet item styles](https://developer.apple.com/documentation/uikit/uialertaction/style)).
iOS will respond with a message when the user selects an action, with the selectedLink property filled in. I then use [Turbo](https://turbo.hotwired.dev/) to ‘visit’ this URL  - this is essentially window.location, but with extra powers around other native integration (e.g. open a URL modally).

The iOS code is super simple, it just responds to ‘present’ messages by opening an action sheet, and replying with the selected item:

```swift
import SwiftUI
import Strada

final class DropdownNavigationSheetComponent: BridgeComponent {
    override class var name: String { "dropdown-navigation-sheet" }

    override func onReceive(message: Message) {
           guard let event = Event(rawValue: message.event) else {
               return
           }

           switch event {
           case .present:
               handlePresentEvent(message: message)
           }
       }

    private var viewController: UIViewController? {
           delegate.destination as? UIViewController
   }


    private func handlePresentEvent(message: Message) {
        let alertController = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        guard var data: PresentMessageData = message.data() else { return }
        let links = data.links

        for (index, link) in links.enumerated() {
            let action = UIAlertAction(title: link.text, style: link.actionStyle()) { [weak self] _ in
                let newData = PresentMessageData(links: links, selectedLink: links[index])
                self!.reply(with: message.replacing(data: newData))
            }
            alertController.addAction(action)
        }

        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        alertController.addAction(cancelAction)

        viewController!.present(alertController, animated: true, completion: nil)
    }


}

private extension DropdownNavigationSheetComponent {
    enum Event: String {
        case present
    }

    struct DropdownNavigationSheetLink: Encodable, Decodable {
        let url: String?
        let text: String
        var style: String = "default"

        func actionStyle() -> UIAlertAction.Style {
            switch self.style {
            case "destructive":
                    .destructive
            case "cancel":
                    .cancel
            default:
                    .default
            }
        }
    }


    struct PresentMessageData: Encodable, Decodable {
        let links: [DropdownNavigationSheetLink]
        let selectedLink: DropdownNavigationSheetLink?
    }
}
```

> I use some ! assertions in here to make sure things fall over when properties I expect to be defined are not. Honestly I could probably change these to be ? and it can just do nothing.


The markup that invokes this is also pretty simple. I build the links collection in ERB which is pretty gross, but also contained to this menu partial, and I can quite easily extract it to an object. This is one of the times I kind of want to use viewcomponents, but I also then would be adding a dependency for this one thing. The reason I pass the links as a value is just to not encode anything in the Stimulus controller, since I’ll use different links based on user access and permissions, and in different places.

```erb
<% links = [
    policy(progress_update).show? ? { text: "Share", url: share_path, style: "default" } : nil,
    policy(progress_update).edit? ? { text: "Edit", url:  edit_path, style: "default" } : nil
  ].compact %>

  <% button_attrs.merge!(data: {
    controller: "bridge--dropdown-navigation-sheet",
    action: "bridge--dropdown-navigation-sheet#present",
    bridge__dropdown_navigation_sheet_links_value: links
  }) %>

  # button_attrs then gets used to make a button, e.g.
  button_tag("More options", **button_attrs)
```





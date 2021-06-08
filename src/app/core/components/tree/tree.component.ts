import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NestedTreeControl, CdkNestedTreeNode } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Locale } from '../../interfaces/locale';

// Services
import { DataService } from '../../services/data.service';

@Component({
  selector: 'core-tree',
  templateUrl: './tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<Locale>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Locale>();

  constructor(
    private data: DataService,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.data.tree$.subscribe(tree => {
      this.dataSource.data = tree;
    });
  }

  onNodeClick(node) {
    if (node && node.path !== this.data.currentNode$.value?.path) {
      this.data.currentNode$.next(node);
    }
  }

  onNodeDoubleClick(node) {
    this.treeControl.toggle(node);
  }

  preventClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  trackByKey(index: string, node: Locale) {
    return node.key;
  }

  hasChild = (_: number, node: Locale) => !!node.children && node.children.length > 0;
}


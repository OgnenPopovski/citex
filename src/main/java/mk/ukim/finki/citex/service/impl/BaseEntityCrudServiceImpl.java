/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mk.ukim.finki.citex.service.impl;

import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import mk.ukim.finki.citex.model.BaseEntity;
import mk.ukim.finki.citex.repository.JpaSpecificationRepository;
import mk.ukim.finki.citex.service.BaseEntityCrudService;

/**
 *
 * @author Ognen
 * @param <T>
 * @param <R>
 */
//public abstract class BaseEntityCrudServiceImpl<T extends BaseEntity, R extends JpaRepository<T, Integer>>
public abstract class BaseEntityCrudServiceImpl<T extends BaseEntity, R extends JpaSpecificationRepository<T>>
        implements BaseEntityCrudService<T> {

    protected abstract R getRepository();

    @Override
    public void save(T entity) {
        getRepository().save(entity);

    }

    @Override
    public Collection<T> findAll() {
        return getRepository().findAll();
    }

    @Override
    public List<T> save(Iterable<T> entities) {
        return getRepository().save(entities);
    }

    @Override
    public T saveAndFlush(T entity) {
        return getRepository().saveAndFlush(entity);
    }

    @Override
    @Transactional
    public T findById(Integer id) {
        return getRepository().findOne(id);
    }

    @Override
    public void delete(Integer id) {
        getRepository().delete(id);
    }

    @Override
    public Page<T> findAll(Pageable pageable) {
        return getRepository().findAll(pageable);
    }

    @Override
    public List<T> findAll(Sort sort) {
        return getRepository().findAll(sort);
    }

    @Override
    public List<T> findAll(Iterable<Integer> ids) {
        return getRepository().findAll(ids);
    }

    @Override
    public List<T> findAll(Specification<T> spec) {
        return getRepository().findAll(spec);
    }

    @Override
    public Page<T> findAll(Specification<T> spec, Pageable pageable) {
        return getRepository().findAll(spec, pageable);
    }

    @Override
    public List<T> findAll(Specification<T> spec, Sort sort) {
        return getRepository().findAll(spec, sort);
    }

    @Override
    public long count() {
        return getRepository().count();
    }

    @Override
    public long count(Specification<T> spec) {
        return getRepository().count(spec);
    }

    @Override
    public T findOne(Specification<T> spec) {
        return getRepository().findOne(spec);
    }

    @Override
    public boolean exists(Integer id) {
        return getRepository().exists(id);
    }

    @Override
    public void delete(T entity) {
        getRepository().delete(entity);
    }

    @Override
    public void delete(Iterable<T> entities) {
        getRepository().delete(entities);
    }

    @Override
    public void deleteAll() {
        getRepository().deleteAll();
    }
}
